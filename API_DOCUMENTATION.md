# Zr3i Carbon Sequestration Platform - API Documentation

**Base URL:** `https://www.zr3i.com/api`

---

## Table of Contents

1. [Health Check](#health-check)
2. [Satellite Monitoring](#satellite-monitoring)
3. [Carbon Calculations](#carbon-calculations)
4. [Error Handling](#error-handling)
5. [Rate Limiting](#rate-limiting)
6. [Authentication](#authentication)

---

## Health Check

### Endpoint
```
GET /api/health
```

### Description
Checks the health status of all backend services.

### Request
```bash
curl -X GET https://www.zr3i.com/api/health
```

### Response
**Status Code:** 200 OK

```json
{
  "status": "healthy",
  "timestamp": "2025-11-30T10:05:48.384Z",
  "version": "1.0.0",
  "services": {
    "satellite": "operational",
    "carbon": "operational",
    "auth": "operational"
  }
}
```

### Response Fields
| Field | Type | Description |
|-------|------|-------------|
| `status` | string | Overall health status: "healthy" or "degraded" |
| `timestamp` | string | ISO 8601 timestamp of the check |
| `version` | string | API version |
| `services` | object | Status of individual services |

---

## Satellite Monitoring

### Endpoint
```
GET /api/satellite
```

### Description
Retrieves satellite imagery data and vegetation indices for a specified farm location.

### Query Parameters
| Parameter | Type | Required | Description | Example |
|-----------|------|----------|-------------|---------|
| `lat` | number | Yes | Latitude of the farm | 30.0444 |
| `lng` | number | Yes | Longitude of the farm | 31.2357 |
| `months` | number | No | Number of months to retrieve (default: 3) | 6 |

### Request
```bash
curl -X GET "https://www.zr3i.com/api/satellite?lat=30.0444&lng=31.2357&months=3"
```

### Response
**Status Code:** 200 OK

```json
{
  "success": true,
  "data": {
    "images": [
      {
        "id": "S2_2025-11-30_abc123def456",
        "date": "2025-11-30",
        "source": "Sentinel-2",
        "ndvi": 0.65,
        "evi": 0.55,
        "ndbi": 0.15,
        "ndmi": 0.35,
        "cloudCover": 5.2,
        "url": "https://tiles.sentinel-hub.com/v1/wms?REQUEST=GetMap&...",
        "metadata": {
          "tileId": "T36SUA",
          "datastrip": "S2A_MSIL2A_20251130T083211_N0511_R064_T36SUA_20251130T121601",
          "processingLevel": "L2A"
        }
      }
    ],
    "statistics": {
      "averageNDVI": 0.65,
      "averageEVI": 0.55,
      "averageCloudCover": 5.2,
      "healthStatus": "Excellent",
      "recommendation": "Farm is in excellent condition"
    },
    "location": {
      "latitude": 30.0444,
      "longitude": 31.2357,
      "timestamp": "2025-11-30T10:05:48.384Z"
    }
  }
}
```

### Response Fields

#### Images Array
| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Unique identifier for the satellite image |
| `date` | string | Date of the satellite image (YYYY-MM-DD) |
| `source` | string | Data source (e.g., "Sentinel-2") |
| `ndvi` | number | Normalized Difference Vegetation Index (0-1) |
| `evi` | number | Enhanced Vegetation Index (0-1) |
| `ndbi` | number | Normalized Difference Built-up Index (0-1) |
| `ndmi` | number | Normalized Difference Moisture Index (0-1) |
| `cloudCover` | number | Cloud cover percentage (0-100) |
| `url` | string | URL to the satellite image tile |
| `metadata` | object | Additional metadata about the image |

#### Statistics
| Field | Type | Description |
|-------|------|-------------|
| `averageNDVI` | number | Average NDVI across all images |
| `averageEVI` | number | Average EVI across all images |
| `averageCloudCover` | number | Average cloud cover percentage |
| `healthStatus` | string | Farm health assessment: "Excellent", "Good", "Needs Attention" |
| `recommendation` | string | Actionable recommendation for the farmer |

#### Location
| Field | Type | Description |
|-------|------|-------------|
| `latitude` | number | Latitude of the farm |
| `longitude` | number | Longitude of the farm |
| `timestamp` | string | ISO 8601 timestamp of the request |

### Vegetation Index Interpretation

**NDVI (Normalized Difference Vegetation Index)**
- 0.7+ : Excellent vegetation health
- 0.5-0.7 : Good vegetation health
- <0.5 : Needs attention (possible stress or sparse vegetation)

**EVI (Enhanced Vegetation Index)**
- More sensitive to canopy structure
- Better for areas with dense vegetation
- Range: 0-1

**NDBI (Normalized Difference Built-up Index)**
- Identifies built-up areas and urban features
- Range: 0-1

**NDMI (Normalized Difference Moisture Index)**
- Indicates soil and vegetation moisture content
- Range: 0-1

### Error Response
**Status Code:** 400 Bad Request

```json
{
  "error": "Missing latitude and longitude parameters"
}
```

---

## Carbon Calculations

### Endpoint
```
POST /api/carbon
```

### Description
Calculates carbon sequestration metrics and income projections based on farm parameters.

### Request Body
```json
{
  "farmSize": 10,
  "treeAge": 5,
  "cropType": "Date Palms",
  "soilType": "Sandy Loam"
}
```

### Request Parameters
| Parameter | Type | Required | Description | Example |
|-----------|------|----------|-------------|---------|
| `farmSize` | number | Yes | Farm size in hectares | 10 |
| `treeAge` | number | Yes | Average tree age in years | 5 |
| `cropType` | string | No | Type of crop (default: "Date Palms") | "Date Palms" |
| `soilType` | string | No | Type of soil (default: "Sandy Loam") | "Sandy Loam" |

### Request
```bash
curl -X POST https://www.zr3i.com/api/carbon \
  -H "Content-Type: application/json" \
  -d '{
    "farmSize": 10,
    "treeAge": 5,
    "cropType": "Date Palms",
    "soilType": "Sandy Loam"
  }'
```

### Response
**Status Code:** 200 OK

```json
{
  "success": true,
  "data": {
    "farmMetrics": {
      "farmSize": 10,
      "totalTrees": 1000,
      "treeAge": 5,
      "cropType": "Date Palms",
      "soilType": "Sandy Loam"
    },
    "carbonMetrics": {
      "annualCO2Sequestered": 500,
      "annualCreditValue": 7500,
      "monthlyIncome": 625,
      "ratePerTree": 0.5
    },
    "projections": [
      {
        "year": 1,
        "co2Sequestered": 500,
        "estimatedIncome": 7500,
        "cumulativeCO2": 500
      },
      {
        "year": 2,
        "co2Sequestered": 500,
        "estimatedIncome": 7500,
        "cumulativeCO2": 1000
      },
      {
        "year": 3,
        "co2Sequestered": 500,
        "estimatedIncome": 7500,
        "cumulativeCO2": 1500
      },
      {
        "year": 4,
        "co2Sequestered": 500,
        "estimatedIncome": 7500,
        "cumulativeCO2": 2000
      },
      {
        "year": 5,
        "co2Sequestered": 500,
        "estimatedIncome": 7500,
        "cumulativeCO2": 2500
      }
    ],
    "environmentalImpact": {
      "equivalentTrees": 23810,
      "equivalentCarsRemovedFromRoad": 109,
      "equivalentHomesElectricityOffset": 104,
      "equivalentFlightsOffset": 556
    },
    "timestamp": "2025-11-30T10:05:48.384Z"
  }
}
```

### Response Fields

#### Farm Metrics
| Field | Type | Description |
|-------|------|-------------|
| `farmSize` | number | Farm size in hectares |
| `totalTrees` | number | Estimated total number of trees (100 trees/hectare) |
| `treeAge` | number | Average tree age in years |
| `cropType` | string | Type of crop |
| `soilType` | string | Type of soil |

#### Carbon Metrics
| Field | Type | Description |
|-------|------|-------------|
| `annualCO2Sequestered` | number | Annual CO₂ sequestration in tons |
| `annualCreditValue` | number | Annual value in USD ($15/ton) |
| `monthlyIncome` | number | Monthly income in USD |
| `ratePerTree` | number | CO₂ sequestration rate per tree per year (tons) |

#### Projections Array
| Field | Type | Description |
|-------|------|-------------|
| `year` | number | Year of projection (1-5) |
| `co2Sequestered` | number | CO₂ sequestered in that year (tons) |
| `estimatedIncome` | number | Estimated income for that year (USD) |
| `cumulativeCO2` | number | Cumulative CO₂ sequestered through that year (tons) |

#### Environmental Impact
| Field | Type | Description |
|-------|------|-------------|
| `equivalentTrees` | number | Equivalent number of trees planted |
| `equivalentCarsRemovedFromRoad` | number | Equivalent cars removed from road for one year |
| `equivalentHomesElectricityOffset` | number | Equivalent homes' electricity offset for one year |
| `equivalentFlightsOffset` | number | Equivalent flights offset |

### CO₂ Sequestration Rates by Tree Age
| Age | Rate (tons CO₂/tree/year) |
|-----|---------------------------|
| 1-2 years | 0.1 |
| 3-4 years | 0.3 |
| 5-9 years | 0.5 |
| 10+ years | 0.6 |

### Carbon Credit Pricing
- **Standard Rate:** $15 per ton CO₂
- **Calculation:** Annual CO₂ × $15 = Annual Credit Value

### Error Response
**Status Code:** 400 Bad Request

```json
{
  "error": "Missing required parameters: farmSize, treeAge"
}
```

---

## Error Handling

### Standard Error Response Format
```json
{
  "error": "Error message describing what went wrong",
  "message": "Additional details if available"
}
```

### Common HTTP Status Codes
| Status | Meaning | Example |
|--------|---------|---------|
| 200 | Success | Request completed successfully |
| 400 | Bad Request | Missing or invalid parameters |
| 405 | Method Not Allowed | Using wrong HTTP method (e.g., GET instead of POST) |
| 500 | Internal Server Error | Server-side error |

### Example Error Responses

**Missing Parameters:**
```json
{
  "error": "Missing latitude and longitude parameters"
}
```

**Invalid Coordinates:**
```json
{
  "error": "Invalid coordinates",
  "message": "Latitude must be between -90 and 90"
}
```

**Server Error:**
```json
{
  "error": "Failed to fetch satellite data",
  "message": "Connection timeout"
}
```

---

## Rate Limiting

### Current Limits
- **Satellite API:** 100 requests per hour per IP
- **Carbon API:** 1000 requests per hour per IP
- **Health Check:** Unlimited

### Rate Limit Headers
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1701337548
```

### Rate Limit Exceeded Response
**Status Code:** 429 Too Many Requests

```json
{
  "error": "Rate limit exceeded",
  "retryAfter": 3600
}
```

---

## Authentication

### Current Status
- Public endpoints (no authentication required)
- Future: OAuth 2.0 integration planned

### Future Authentication
```
Authorization: Bearer <JWT_TOKEN>
```

---

## Code Examples

### JavaScript/Node.js
```javascript
// Fetch satellite data
const response = await fetch(
  'https://www.zr3i.com/api/satellite?lat=30.0444&lng=31.2357&months=3'
);
const data = await response.json();
console.log(data.data.statistics);

// Calculate carbon metrics
const calcResponse = await fetch('https://www.zr3i.com/api/carbon', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    farmSize: 10,
    treeAge: 5
  })
});
const calcData = await calcResponse.json();
console.log(calcData.data.carbonMetrics);
```

### Python
```python
import requests
import json

# Fetch satellite data
response = requests.get(
    'https://www.zr3i.com/api/satellite',
    params={'lat': 30.0444, 'lng': 31.2357, 'months': 3}
)
data = response.json()
print(data['data']['statistics'])

# Calculate carbon metrics
calc_response = requests.post(
    'https://www.zr3i.com/api/carbon',
    json={'farmSize': 10, 'treeAge': 5}
)
calc_data = calc_response.json()
print(calc_data['data']['carbonMetrics'])
```

### cURL
```bash
# Health check
curl https://www.zr3i.com/api/health

# Satellite data
curl "https://www.zr3i.com/api/satellite?lat=30.0444&lng=31.2357&months=3"

# Carbon calculation
curl -X POST https://www.zr3i.com/api/carbon \
  -H "Content-Type: application/json" \
  -d '{"farmSize":10,"treeAge":5}'
```

---

## Changelog

### Version 1.0.0 (November 30, 2025)
- ✅ Health check endpoint
- ✅ Satellite monitoring API
- ✅ Carbon calculation API
- ✅ Comprehensive documentation

---

**Last Updated:** November 30, 2025  
**API Version:** 1.0.0  
**Status:** Production Ready ✅
