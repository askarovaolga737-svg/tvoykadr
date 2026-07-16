import { docClient } from "./db";
import {
  GetCommand,
  PutCommand,
  DeleteCommand,
  QueryCommand,
  ScanCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import { TableName, IndexName } from "./schema";

export interface Service {
  id: string;
  name: string;
  description?: string;
  status: "active" | "inactive" | "deploying";
  url?: string;
  createdAt: string;
  updatedAt: string;
}

export async function getServiceById(id: string): Promise<Service | null> {
  const result = await docClient.send(
    new GetCommand({
      TableName: TableName.SERVICES,
      Key: { id },
    })
  );
  return (result.Item as Service) ?? null;
}

export async function getServicesByStatus(status: string): Promise<Service[]> {
  const result = await docClient.send(
    new QueryCommand({
      TableName: TableName.SERVICES,
      IndexName: IndexName.SERVICES_STATUS,
      KeyConditionExpression: "#status = :status",
      ExpressionAttributeNames: {
        "#status": "status",
      },
      ExpressionAttributeValues: {
        ":status": status,
      },
    })
  );
  return (result.Items as Service[]) ?? [];
}

export async function getAllServices(): Promise<Service[]> {
  const result = await docClient.send(
    new ScanCommand({
      TableName: TableName.SERVICES,
    })
  );
  return (result.Items as Service[]) ?? [];
}

export async function createService(
  data: Omit<Service, "createdAt" | "updatedAt">
): Promise<Service> {
  const now = new Date().toISOString();
  const service: Service = {
    ...data,
    createdAt: now,
    updatedAt: now,
  };

  await docClient.send(
    new PutCommand({
      TableName: TableName.SERVICES,
      Item: service,
    })
  );

  return service;
}

export async function updateService(
  id: string,
  data: Partial<Pick<Service, "name" | "description" | "status" | "url">>
): Promise<Service> {
  const updateExpr = [];
  const exprValues: Record<string, unknown> = {};
  const exprNames: Record<string, string> = {};

  if (data.name !== undefined) {
    updateExpr.push("#name = :name");
    exprValues[":name"] = data.name;
    exprNames["#name"] = "name";
  }

  if (data.description !== undefined) {
    updateExpr.push("#description = :description");
    exprValues[":description"] = data.description;
    exprNames["#description"] = "description";
  }

  if (data.status !== undefined) {
    updateExpr.push("#status = :status");
    exprValues[":status"] = data.status;
    exprNames["#status"] = "status";
  }

  if (data.url !== undefined) {
    updateExpr.push("#url = :url");
    exprValues[":url"] = data.url;
    exprNames["#url"] = "url";
  }

  updateExpr.push("updatedAt = :updatedAt");
  exprValues[":updatedAt"] = new Date().toISOString();

  const result = await docClient.send(
    new UpdateCommand({
      TableName: TableName.SERVICES,
      Key: { id },
      UpdateExpression: `set ${updateExpr.join(", ")}`,
      ExpressionAttributeValues: exprValues,
      ExpressionAttributeNames:
        Object.keys(exprNames).length > 0 ? exprNames : undefined,
      ReturnValues: "ALL_NEW",
    })
  );

  return result.Attributes as Service;
}

export async function deleteService(id: string): Promise<void> {
  await docClient.send(
    new DeleteCommand({
      TableName: TableName.SERVICES,
      Key: { id },
    })
  );
}

export type ContentType =
  | "frame"
  | "image"
  | "video"
  | "video_template"
  | "cartoon_template";

export interface ContentItem {
  id: string;
  type: ContentType;
  title: string;
  fileUrl: string;
  createdAt: string;
  updatedAt: string;
}

export async function getContentByType(
  type: ContentType
): Promise<ContentItem[]> {
  const result = await docClient.send(
    new QueryCommand({
      TableName: TableName.CONTENT,
      IndexName: IndexName.CONTENT_TYPE,
      KeyConditionExpression: "#type = :type",
      ExpressionAttributeNames: { "#type": "type" },
      ExpressionAttributeValues: { ":type": type },
    })
  );
  return (result.Items as ContentItem[]) ?? [];
}

export async function getAllContent(): Promise<ContentItem[]> {
  const result = await docClient.send(
    new ScanCommand({
      TableName: TableName.CONTENT,
    })
  );
  return (result.Items as ContentItem[]) ?? [];
}

export async function createContentItem(
  data: Omit<ContentItem, "createdAt" | "updatedAt">
): Promise<ContentItem> {
  const now = new Date().toISOString();
  const item: ContentItem = { ...data, createdAt: now, updatedAt: now };

  await docClient.send(
    new PutCommand({
      TableName: TableName.CONTENT,
      Item: item,
    })
  );

  return item;
}

export async function deleteContentItem(id: string): Promise<void> {
  await docClient.send(
    new DeleteCommand({
      TableName: TableName.CONTENT,
      Key: { id },
    })
  );
}

export type OrderStatus = "new" | "completed";

export interface Order {
  id: string;
  userName: string;
  userEmail: string;
  description: string;
  fileName: string;
  fileType: string;
  fileData: string;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
}

export async function getAllOrders(): Promise<Order[]> {
  const result = await docClient.send(
    new ScanCommand({
      TableName: TableName.ORDERS,
    })
  );
  return (result.Items as Order[]) ?? [];
}

export async function getOrderById(id: string): Promise<Order | null> {
  const result = await docClient.send(
    new GetCommand({
      TableName: TableName.ORDERS,
      Key: { id },
    })
  );
  return (result.Item as Order) ?? null;
}

export async function createOrder(
  data: Omit<Order, "createdAt" | "updatedAt" | "status">
): Promise<Order> {
  const now = new Date().toISOString();
  const order: Order = {
    ...data,
    status: "new",
    createdAt: now,
    updatedAt: now,
  };

  await docClient.send(
    new PutCommand({
      TableName: TableName.ORDERS,
      Item: order,
    })
  );

  return order;
}

export async function updateOrderStatus(
  id: string,
  status: OrderStatus
): Promise<Order> {
  const result = await docClient.send(
    new UpdateCommand({
      TableName: TableName.ORDERS,
      Key: { id },
      UpdateExpression: "set #status = :status, updatedAt = :updatedAt",
      ExpressionAttributeNames: { "#status": "status" },
      ExpressionAttributeValues: {
        ":status": status,
        ":updatedAt": new Date().toISOString(),
      },
      ReturnValues: "ALL_NEW",
    })
  );
  return result.Attributes as Order;
}

export interface FeedbackMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
}

export async function getAllFeedback(): Promise<FeedbackMessage[]> {
  const result = await docClient.send(
    new ScanCommand({
      TableName: TableName.FEEDBACK,
    })
  );
  return (result.Items as FeedbackMessage[]) ?? [];
}

export async function createFeedback(
  data: Omit<FeedbackMessage, "createdAt">
): Promise<FeedbackMessage> {
  const now = new Date().toISOString();
  const item: FeedbackMessage = { ...data, createdAt: now };

  await docClient.send(
    new PutCommand({
      TableName: TableName.FEEDBACK,
      Item: item,
    })
  );

  return item;
}
