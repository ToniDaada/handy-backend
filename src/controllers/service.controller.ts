import type { Request, Response } from "express";

import { addService, editService, getAllServices, getServiceById, removeService, type ServiceChanges } from "../models/service.model.js";

export function listServices(req: Request, res: Response): void {
  const search = req.query.search;
  const category = req.query.category;
  const pageValue = req.query.page;
  const limitValue = req.query.limit;

  if (search !== undefined && typeof search !== "string") {
    res.status(400).json({ message: "search must be one text value." });
    return;
  }

  if (category !== undefined && (typeof category !== "string" || category.trim() === "")) {
    res.status(400).json({ message: "category must be one non-empty text value." });
    return;
  }

  if (pageValue !== undefined && typeof pageValue !== "string") {
    res.status(400).json({ message: "page must be a positive integer." });
    return;
  }

  if (limitValue !== undefined && typeof limitValue !== "string") {
    res.status(400).json({ message: "limit must be an integer between 1 and 100." });
    return;
  }

  const page = pageValue === undefined ? 1 : Number(pageValue);
  const limit = limitValue === undefined ? 10 : Number(limitValue);

  if (!Number.isInteger(page) || page < 1) {
    res.status(400).json({ message: "page must be a positive integer." });
    return;
  }

  if (!Number.isInteger(limit) || limit < 1 || limit > 100) {
    res.status(400).json({ message: "limit must be an integer between 1 and 100." });
    return;
  }

  let filteredServices = getAllServices();

  if (search) {
    const searchText = search.toLowerCase();

    filteredServices = filteredServices.filter(service => service.title.toLowerCase().includes(searchText));
  }

  if (category) {
    const categoryText = category.toLowerCase();

    filteredServices = filteredServices.filter(service => service.category.toLowerCase() === categoryText);
  }

  const total = filteredServices.length;
  const totalPages = Math.ceil(total / limit);
  const startIndex = (page - 1) * limit;
  const data = filteredServices.slice(startIndex, startIndex + limit);

  res.status(200).json({
    message: "Services retrieved successfully.",
    data,
    total,
    page,
    totalPages,
  });
}

export function getService(req: Request, res: Response): void {
  const service = getServiceById(req.params.id);

  if (!service) {
    res.status(404).json({ message: "Service not found." });
    return;
  }

  res.status(200).json({ message: "Service retrieved successfully.", data: service });
}

export function createService(req: Request, res: Response): void {
  const body = req.body;

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    res.status(400).json({ message: "Request body must be a JSON object." });
    return;
  }

  const { title, description, category, price, duration_minutes } = body;

  if (title === undefined || description === undefined || category === undefined || price === undefined || duration_minutes === undefined) {
    res.status(400).json({ message: "title, description, category, price and duration_minutes are required." });
    return;
  }

  if (typeof title !== "string" || title.trim() === "") {
    res.status(400).json({ message: "title must be a non-empty string." });
    return;
  }

  if (typeof description !== "string" || description.trim() === "") {
    res.status(400).json({ message: "description must be a non-empty string." });
    return;
  }

  if (typeof category !== "string" || category.trim() === "") {
    res.status(400).json({ message: "category must be a non-empty string." });
    return;
  }

  if (typeof price !== "number" || !Number.isFinite(price) || price < 0) {
    res.status(400).json({ message: "price must be a non-negative number in naira." });
    return;
  }

  const priceInKobo = Math.round(price * 100);

  if (Math.abs(price * 100 - priceInKobo) > 1e-8 || !Number.isSafeInteger(priceInKobo)) {
    res.status(400).json({ message: "price must have no more than two decimal places." });
    return;
  }

  if (!Number.isInteger(duration_minutes) || duration_minutes <= 0) {
    res.status(400).json({ message: "duration_minutes must be a positive integer." });
    return;
  }

  const service = addService({
    title: title.trim(),
    description: description.trim(),
    category: category.trim(),
    price_minor: priceInKobo,
    duration_minutes,
  });

  res.status(201).json({ message: "Service created successfully.", data: service });
}

export function updateService(req: Request, res: Response): void {
  const existingService = getServiceById(req.params.id);

  if (!existingService) {
    res.status(404).json({ message: "Service not found." });
    return;
  }

  const body = req.body;

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    res.status(400).json({ message: "Request body must be a JSON object." });
    return;
  }

  const allowedFields = ["title", "description", "category", "price", "duration_minutes"];
  const receivedFields = Object.keys(body);
  const unsupportedField = receivedFields.find(field => !allowedFields.includes(field));

  if (unsupportedField) {
    res.status(400).json({ message: `${unsupportedField} is not a field that can be updated.` });
    return;
  }

  if (receivedFields.length === 0) {
    res.status(400).json({ message: "Provide at least one field to update." });
    return;
  }

  const changes: ServiceChanges = {};

  if (body.title !== undefined) {
    if (typeof body.title !== "string" || body.title.trim() === "") {
      res.status(400).json({ message: "title must be a non-empty string." });
      return;
    }

    changes.title = body.title.trim();
  }

  if (body.description !== undefined) {
    if (typeof body.description !== "string" || body.description.trim() === "") {
      res.status(400).json({ message: "description must be a non-empty string." });
      return;
    }

    changes.description = body.description.trim();
  }

  if (body.category !== undefined) {
    if (typeof body.category !== "string" || body.category.trim() === "") {
      res.status(400).json({ message: "category must be a non-empty string." });
      return;
    }

    changes.category = body.category.trim();
  }

  if (body.price !== undefined) {
    if (typeof body.price !== "number" || !Number.isFinite(body.price) || body.price < 0) {
      res.status(400).json({ message: "price must be a non-negative number in naira." });
      return;
    }

    const priceInKobo = Math.round(body.price * 100);

    if (Math.abs(body.price * 100 - priceInKobo) > 1e-8 || !Number.isSafeInteger(priceInKobo)) {
      res.status(400).json({ message: "price must have no more than two decimal places." });
      return;
    }

    changes.price_minor = priceInKobo;
  }

  if (body.duration_minutes !== undefined) {
    if (!Number.isInteger(body.duration_minutes) || body.duration_minutes <= 0) {
      res.status(400).json({ message: "duration_minutes must be a positive integer." });
      return;
    }

    changes.duration_minutes = body.duration_minutes;
  }

  const updatedService = editService(req.params.id, changes);

  res.status(200).json({ message: "Service updated successfully.", data: updatedService });
}

export function deleteService(req: Request, res: Response): void {
  const deletedService = removeService(req.params.id);

  if (!deletedService) {
    res.status(404).json({ message: "Service not found." });
    return;
  }

  res.status(200).json({ message: "Service deleted successfully.", data: deletedService });
}
