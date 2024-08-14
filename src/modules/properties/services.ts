import db from "@/database";
import { and, asc, between, count, desc, gt, lt, sql } from "drizzle-orm";
import type { MySqlSelect } from "drizzle-orm/mysql-core";
import { property } from "@/database/schema";
import type { MapSearchQuery } from "./interface/map-search-query";
import type { PropertyListingQuery } from "./interface/property-listing-query";

export const propertyListings = async ({
  cursor = 1,
  pageSize = 10,
  listingType,
  propertyType,
  sortOrder = "id",
}: PropertyListingQuery) => {
  const page = cursor;

  const selectedProperties = {
    id: property.id,
    latitude: property.latitude,
    longitude: property.longitude,
    price: property.price,
    landSize: property.landSize,
    buildingSize: property.buildingSize,
    yearBuilt: property.yearBuilt,
    primaryImageUrl: property.primaryImageUrl,
    offerType: sql`JSON_EXTRACT(${property.jsonData}, '$.attributes.offer_type')`,
    title: sql`JSON_EXTRACT(${property.jsonData}, '$.title')`,
    formatted_price: sql`JSON_EXTRACT(${property.jsonData}, '$.attributes.price_formatted')`,
    area: sql`JSON_EXTRACT(${property.jsonData}, '$.location.area')`,
    city: sql`JSON_EXTRACT(${property.jsonData}, '$.location.city')`,
    region: sql`JSON_EXTRACT(${property.jsonData}, '$.location.region')`,
    href: sql`CONCAT('https://lamudi.com.ph/', REPLACE(IFNULL(JSON_EXTRACT(${property.jsonData}, '$.attributes.urlkey_details'), ''), '"', ''))`,
  };

  function withPagination<T extends MySqlSelect>(
    qb: T,
    page: number = 1,
    pageSize: number = 300
  ) {
    const order = {
      id: desc(property.id),
      newest: desc(property.createdAt),
      "price-low-to-high": asc(property.price),
      "price-high-to-low": desc(property.price),
    };

    return qb
      .limit(pageSize)
      .offset((page - 1) * pageSize)
      .orderBy(order[sortOrder as keyof typeof order]);
  }

  // Count total records
  const totalRecordsQuery = db.select({ count: count() }).from(property);
  const totalRecordsResult = await totalRecordsQuery;
  const totalRecords = totalRecordsResult[0].count;

  // Compute total pages
  const totalPages = Math.ceil(totalRecords / pageSize);

  // Determine next and previous pages
  const nextPage = page < totalPages ? page + 1 : null;
  const previousPage = page > 1 ? page - 1 : null;

  const query = db
    .select(selectedProperties)
    .from(property)
    .where(
      and(
        listingType
          ? sql`JSON_EXTRACT(${property.jsonData}, '$.attributes.offer_type') = ${listingType}`
          : undefined,
        propertyType
          ? sql`JSON_EXTRACT(${
              property.jsonData
            }, '$.attributes.attribute_set_name') = ${
              propertyType.split("::")[0]
            }`
          : undefined,
        propertyType
          ? sql`JSON_EXTRACT(${
              property.jsonData
            }, '$.attributes.subcategory') = ${propertyType.split("::")[1]}`
          : undefined
      )
    );

  const dynamicQuery = query.$dynamic();
  const results = await withPagination(dynamicQuery, page, pageSize);

  return {
    properties: {
      results,
    },
    totalRecords,
    totalPages,
    currentPage: page,
    nextPage,
    previousPage,
  };
};

export const propertyMapSearch = async ({
  minLat,
  maxLat,
  minLong,
  maxLong,
  pointOfInterestLat,
  pointOfInterestLong,
  distanceInKilometers,
  offerType,
  cursor,
  prevCursor,
}: MapSearchQuery) => {
  const query = db
    .select({
      id: property.id,
      latitude: property.latitude,
      longitude: property.longitude,
      price: property.price,
      landSize: property.landSize,
      buildingSize: property.buildingSize,
      yearBuilt: property.yearBuilt,
      primaryImageUrl: property.primaryImageUrl,
      offerType: sql`JSON_EXTRACT(${property.jsonData}, '$.attributes.offer_type')`,
      title: sql`JSON_EXTRACT(${property.jsonData}, '$.title')`,
      formatted_price: sql`JSON_EXTRACT(${property.jsonData}, '$.attributes.price_formatted')`,
      area: sql`JSON_EXTRACT(${property.jsonData}, '$.location.area')`,
      city: sql`JSON_EXTRACT(${property.jsonData}, '$.location.city')`,
      region: sql`JSON_EXTRACT(${property.jsonData}, '$.location.region')`,
      href: sql`CONCAT('https://lamudi.com.ph/', REPLACE(IFNULL(JSON_EXTRACT(${property.jsonData}, '$.attributes.urlkey_details'), ''), '"', ''))`,
    })
    .from(property)
    .where(
      and(
        between(property.latitude, minLat, maxLat),
        between(property.longitude, minLong, maxLong),
        sql`ST_distance_sphere(
          point(${pointOfInterestLong}, ${pointOfInterestLat}), 
          point(${property.longitude}, ${property.latitude})
        ) * 0.001 <= ${distanceInKilometers}`,
        offerType
          ? sql`JSON_EXTRACT(${property.jsonData}, '$.attributes.offer_type') = ${offerType}`
          : undefined,
        cursor ? gt(property.id, cursor) : undefined,
        prevCursor ? lt(property.id, prevCursor) : undefined
      )
    );

  const results = await query.orderBy(property.id).limit(1000);

  const prevId = cursor
    ? await db
        .select({ id: property.id })
        .from(property)
        .where(lt(property.id, cursor))
        .orderBy(desc(property.id))
        .limit(1)
        .then((rows) => rows[0]?.id || null)
    : null;

  const nextId =
    results.length === 100
      ? await db
          .select({ id: property.id })
          .from(property)
          .where(gt(property.id, results[results.length - 1].id))
          .orderBy(property.id)
          .limit(1)
          .then((rows) => rows[0]?.id || null)
      : null;

  const prevCursorValue = results.length > 0 && prevId ? results[0].id : null;

  return {
    properties: {
      results,
    },
    prevId,
    nextId,
    prevCursor: prevCursorValue,
  };
};
