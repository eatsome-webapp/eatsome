# API Specifications

## 1. API Overview

### 1.1 Architecture

The All-in-One Food Platform API is built on a modern RESTful architecture with some GraphQL capabilities for complex data requirements. The API is organized around resources, using standard HTTP methods, status codes, and JSON data format.

### 1.2 Base URLs

**Production Environment:**
```
https://api.eatsome.com/v1
```

**Staging Environment:**
```
https://staging-api.eatsome.com/v1
```

**Development Environment:**
```
https://dev-api.eatsome.com/v1
```

### 1.3 API Versioning

- API version is included in the URL path (`/v1/`)
- Future versions will use incrementing version numbers (`/v2/`, `/v3/`, etc.)
- Version deprecation notices will be provided at least 6 months in advance

### 1.4 Authentication

The API uses JWT (JSON Web Tokens) for authentication:

**Authorization Header:**
```
Authorization: Bearer {jwt_token}
```

**Token Acquisition:**
- Tokens are obtained through the authentication endpoints
- Tokens expire after 1 hour
- Refresh tokens are valid for 30 days
- Role-based access control is enforced at the API level

### 1.5 Rate Limiting

- 100 requests per minute for authenticated users
- 20 requests per minute for unauthenticated users
- Rate limit headers included in responses:
  - `X-RateLimit-Limit`: Total requests allowed in period
  - `X-RateLimit-Remaining`: Requests remaining in period
  - `X-RateLimit-Reset`: Time when limit resets (Unix timestamp)

### 1.6 Common HTTP Status Codes

- `200 OK`: Request succeeded
- `201 Created`: Resource created successfully
- `204 No Content`: Request succeeded with no response body
- `400 Bad Request`: Invalid request format or parameters
- `401 Unauthorized`: Authentication required or failed
- `403 Forbidden`: Authentication succeeded but insufficient permissions
- `404 Not Found`: Resource not found
- `422 Unprocessable Entity`: Valid request but unable to process
- `429 Too Many Requests`: Rate limit exceeded
- `500 Internal Server Error`: Server error

### 1.7 Error Response Format

```json
{
  "error": {
    "code": "invalid_request",
    "message": "A human-readable error message",
    "details": [
      {
        "field": "field_name",
        "issue": "specific issue with this field"
      }
    ]
  }
}
```

### 1.8 Pagination

API endpoints returning collections support pagination:

**Request Parameters:**
- `limit`: Number of items per page (default: 20, max: 100)
- `offset`: Number of items to skip (for offset pagination)
- `cursor`: Cursor value for cursor-based pagination

**Response Format:**
```json
{
  "data": [
    // Array of items
  ],
  "pagination": {
    "total": 243,
    "limit": 20,
    "offset": 40,
    "has_more": true,
    "next_cursor": "Y3Vyc29yXzE2MTIzNDU2Nzg="
  }
}
```

### 1.9 Filtering and Sorting

**Filtering:**
- Filter parameters use the format `field=value` or `field[operator]=value`
- Multiple filters can be combined (treated as AND conditions)
- Example: `/api/v1/restaurants?cuisine=italian&rating[gte]=4`

**Sorting:**
- Sort using the `sort` parameter
- Format: `sort=field` (ascending) or `sort=-field` (descending)
- Multiple sort fields: `sort=field1,-field2`
- Example: `/api/v1/restaurants?sort=-rating,name`

### 1.10 Field Selection

- Optional fields can be requested using the `fields` parameter
- Format: `fields=field1,field2,field3`
- Example: `/api/v1/restaurants?fields=name,cuisine,rating,address`

## 2. Authentication API

### 2.1 User Registration

**Endpoint:** `POST /auth/register`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword",
  "name": "John Doe",
  "phone": "+1234567890"
}
```

**Response:** `201 Created`
```json
{
  "user": {
    "id": "usr_123456789",
    "email": "user@example.com",
    "name": "John Doe",
    "created_at": "2023-01-15T08:30:00Z"
  },
  "token": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expires_at": "2023-01-15T09:30:00Z"
  }
}
```

### 2.2 User Login

**Endpoint:** `POST /auth/login`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

**Response:** `200 OK`
```json
{
  "user": {
    "id": "usr_123456789",
    "email": "user@example.com",
    "name": "John Doe",
    "created_at": "2023-01-15T08:30:00Z"
  },
  "token": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expires_at": "2023-01-15T09:30:00Z"
  }
}
```

### 2.3 Staff Login (PIN-based)

**Endpoint:** `POST /auth/staff-login`

**Request Body:**
```json
{
  "restaurant_id": "rest_123456789",
  "pin": "1234"
}
```

**Response:** `200 OK`
```json
{
  "staff": {
    "id": "staff_123456789",
    "name": "Jane Doe",
    "role": "RESTAURANT_STAFF",
    "restaurant_id": "rest_123456789"
  },
  "token": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expires_at": "2023-01-15T09:30:00Z"
  }
}
```

### 2.4 Refresh Token

**Endpoint:** `POST /auth/refresh`

**Request Body:**
```json
{
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response:** `200 OK`
```json
{
  "token": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expires_at": "2023-01-15T10:30:00Z"
  }
}
```

### 2.5 Logout

**Endpoint:** `POST /auth/logout`

**Headers:**
- `Authorization: Bearer {jwt_token}`

**Response:** `204 No Content`

### 2.6 Password Reset Request

**Endpoint:** `POST /auth/password-reset-request`

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Response:** `200 OK`
```json
{
  "message": "Password reset instructions sent to email"
}
```

### 2.7 Password Reset

**Endpoint:** `POST /auth/password-reset`

**Request Body:**
```json
{
  "token": "reset_token_received_via_email",
  "password": "new_secure_password"
}
```

**Response:** `200 OK`
```json
{
  "message": "Password reset successful"
}
```

## 3. User & Profile API

### 3.1 Get Current User

**Endpoint:** `GET /users/me`

**Headers:**
- `Authorization: Bearer {jwt_token}`

**Response:** `200 OK`
```json
{
  "id": "usr_123456789",
  "email": "user@example.com",
  "name": "John Doe",
  "phone": "+1234567890",
  "created_at": "2023-01-15T08:30:00Z",
  "profile": {
    "avatar_url": "https://assets.eatsome.com/avatars/usr_123456789.jpg",
    "default_address_id": "addr_987654321",
    "notification_preferences": {
      "email": true,
      "push": true,
      "sms": false
    }
  }
}
```

### 3.2 Update User Profile

**Endpoint:** `PATCH /users/me`

**Headers:**
- `Authorization: Bearer {jwt_token}`

**Request Body:**
```json
{
  "name": "John Smith",
  "phone": "+1987654321",
  "profile": {
    "avatar_url": "https://assets.eatsome.com/avatars/custom.jpg",
    "default_address_id": "addr_987654321",
    "notification_preferences": {
      "push": false
    }
  }
}
```

**Response:** `200 OK`
```json
{
  "id": "usr_123456789",
  "email": "user@example.com",
  "name": "John Smith",
  "phone": "+1987654321",
  "created_at": "2023-01-15T08:30:00Z",
  "profile": {
    "avatar_url": "https://assets.eatsome.com/avatars/custom.jpg",
    "default_address_id": "addr_987654321",
    "notification_preferences": {
      "email": true,
      "push": false,
      "sms": false
    }
  }
}
```

### 3.3 Get User Addresses

**Endpoint:** `GET /users/me/addresses`

**Headers:**
- `Authorization: Bearer {jwt_token}`

**Response:** `200 OK`
```json
{
  "data": [
    {
      "id": "addr_987654321",
      "label": "Home",
      "recipient_name": "John Doe",
      "street": "123 Main St",
      "apt_suite": "Apt 4B",
      "city": "New York",
      "state": "NY",
      "postal_code": "10001",
      "country": "US",
      "latitude": 40.7128,
      "longitude": -74.0060,
      "is_default": true,
      "delivery_instructions": "Leave with doorman"
    },
    {
      "id": "addr_987654322",
      "label": "Work",
      "recipient_name": "John Doe",
      "street": "456 Park Ave",
      "apt_suite": "Floor 8",
      "city": "New York",
      "state": "NY",
      "postal_code": "10022",
      "country": "US",
      "latitude": 40.7592,
      "longitude": -73.9730,
      "is_default": false,
      "delivery_instructions": null
    }
  ]
}
```

### 3.4 Add User Address

**Endpoint:** `POST /users/me/addresses`

**Headers:**
- `Authorization: Bearer {jwt_token}`

**Request Body:**
```json
{
  "label": "Home",
  "recipient_name": "John Doe",
  "street": "123 Main St",
  "apt_suite": "Apt 4B",
  "city": "New York",
  "state": "NY",
  "postal_code": "10001",
  "country": "US",
  "delivery_instructions": "Leave with doorman",
  "is_default": true
}
```

**Response:** `201 Created`
```json
{
  "id": "addr_987654321",
  "label": "Home",
  "recipient_name": "John Doe",
  "street": "123 Main St",
  "apt_suite": "Apt 4B",
  "city": "New York",
  "state": "NY",
  "postal_code": "10001",
  "country": "US",
  "latitude": 40.7128,
  "longitude": -74.0060,
  "is_default": true,
  "delivery_instructions": "Leave with doorman"
}
```

### 3.5 Update User Address

**Endpoint:** `PATCH /users/me/addresses/{address_id}`

**Headers:**
- `Authorization: Bearer {jwt_token}`

**URL Parameters:**
- `address_id`: The ID of the address to update

**Request Body:**
```json
{
  "apt_suite": "Apt 5C",
  "delivery_instructions": "Code is 1234",
  "is_default": true
}
```

**Response:** `200 OK`
```json
{
  "id": "addr_987654321",
  "label": "Home",
  "recipient_name": "John Doe",
  "street": "123 Main St",
  "apt_suite": "Apt 5C",
  "city": "New York",
  "state": "NY",
  "postal_code": "10001",
  "country": "US",
  "latitude": 40.7128,
  "longitude": -74.0060,
  "is_default": true,
  "delivery_instructions": "Code is 1234"
}
```

### 3.6 Delete User Address

**Endpoint:** `DELETE /users/me/addresses/{address_id}`

**Headers:**
- `Authorization: Bearer {jwt_token}`

**URL Parameters:**
- `address_id`: The ID of the address to delete

**Response:** `204 No Content`

### 3.7 Get Payment Methods

**Endpoint:** `GET /users/me/payment-methods`

**Headers:**
- `Authorization: Bearer {jwt_token}`

**Response:** `200 OK`
```json
{
  "data": [
    {
      "id": "pm_123456789",
      "type": "card",
      "brand": "visa",
      "last4": "4242",
      "exp_month": 12,
      "exp_year": 2025,
      "is_default": true,
      "billing_address": {
        "postal_code": "10001"
      }
    },
    {
      "id": "pm_987654321",
      "type": "card",
      "brand": "mastercard",
      "last4": "5555",
      "exp_month": 10,
      "exp_year": 2024,
      "is_default": false,
      "billing_address": {
        "postal_code": "10022"
      }
    }
  ]
}
```

## 4. Restaurant & Menu API

### 4.1 List Restaurants

**Endpoint:** `GET /restaurants`

**Query Parameters:**
- `latitude`: Customer latitude for location-based results
- `longitude`: Customer longitude for location-based results
- `radius`: Search radius in kilometers (default: 5)
- `cuisine`: Filter by cuisine type (can be repeated)
- `price_range`: Filter by price range (1-4)
- `is_open`: Filter by currently open (true/false)
- `sort`: Sort results (options: distance, rating, price, popularity)

**Response:** `200 OK`
```json
{
  "data": [
    {
      "id": "rest_123456789",
      "name": "Pizza Palace",
      "description": "Authentic Italian pizza",
      "logo_url": "https://assets.eatsome.com/restaurants/rest_123456789/logo.jpg",
      "hero_image_url": "https://assets.eatsome.com/restaurants/rest_123456789/hero.jpg",
      "cuisine": ["Italian", "Pizza"],
      "price_range": 2,
      "rating": 4.7,
      "review_count": 243,
      "address": {
        "street": "123 Pizza St",
        "city": "New York",
        "state": "NY",
        "postal_code": "10001",
        "country": "US",
        "latitude": 40.7128,
        "longitude": -74.0060
      },
      "distance": 1.2,
      "delivery_time_estimate": "15-25 min",
      "delivery_fee": 2.99,
      "is_open": true,
      "hours": {
        "today": "11:00 AM - 10:00 PM",
        "current_status": "Open"
      }
    }
  ],
  "pagination": {
    "total": 87,
    "limit": 20,
    "offset": 0,
    "has_more": true,
    "next_cursor": "Y3Vyc29yXzE2MTIzNDU2Nzg="
  }
}
```

### 4.2 Get Restaurant Details

**Endpoint:** `GET /restaurants/{restaurant_id}`

**URL Parameters:**
- `restaurant_id`: The ID of the restaurant

**Response:** `200 OK`
```json
{
  "id": "rest_123456789",
  "name": "Pizza Palace",
  "description": "Authentic Italian pizza made with traditional recipes passed down through generations. Our dough is made fresh daily and toppings are locally sourced.",
  "logo_url": "https://assets.eatsome.com/restaurants/rest_123456789/logo.jpg",
  "hero_image_url": "https://assets.eatsome.com/restaurants/rest_123456789/hero.jpg",
  "gallery_images": [
    "https://assets.eatsome.com/restaurants/rest_123456789/gallery1.jpg",
    "https://assets.eatsome.com/restaurants/rest_123456789/gallery2.jpg"
  ],
  "cuisine": ["Italian", "Pizza"],
  "price_range": 2,
  "rating": 4.7,
  "review_count": 243,
  "phone": "+12125556789",
  "email": "info@pizzapalace.com",
  "website": "https://pizzapalace.com",
  "address": {
    "street": "123 Pizza St",
    "city": "New York",
    "state": "NY",
    "postal_code": "10001",
    "country": "US",
    "latitude": 40.7128,
    "longitude": -74.0060
  },
  "hours": {
    "monday": "11:00 AM - 10:00 PM",
    "tuesday": "11:00 AM - 10:00 PM",
    "wednesday": "11:00 AM - 10:00 PM",
    "thursday": "11:00 AM - 10:00 PM",
    "friday": "11:00 AM - 11:00 PM",
    "saturday": "11:00 AM - 11:00 PM",
    "sunday": "12:00 PM - 9:00 PM",
    "today": "11:00 AM - 10:00 PM",
    "current_status": "Open"
  },
  "features": ["Delivery", "Takeout", "Outdoor Seating", "Vegetarian Options"],
  "delivery_time_estimate": "15-25 min",
  "delivery_fee": 2.99,
  "minimum_order": 10.00,
  "is_open": true,
  "accepts_reservations": true
}
```

### 4.3 Get Restaurant Menu

**Endpoint:** `GET /restaurants/{restaurant_id}/menu`

**URL Parameters:**
- `restaurant_id`: The ID of the restaurant

**Query Parameters:**
- `category`: Filter by category name

**Response:** `200 OK`
```json
{
  "data": [
    {
      "id": "cat_123456789",
      "name": "Pizzas",
      "description": "Traditional wood-fired pizzas",
      "items": [
        {
          "id": "item_123456789",
          "name": "Margherita",
          "description": "Tomato sauce, fresh mozzarella, basil",
          "price": 12.99,
          "image_url": "https://assets.eatsome.com/restaurants/rest_123456789/items/margherita.jpg",
          "calories": 850,
          "dietary_info": ["Vegetarian"],
          "customization_options": [
            {
              "id": "opt_123456789",
              "name": "Size",
              "required": true,
              "multiple": false,
              "options": [
                {
                  "id": "choice_123456789",
                  "name": "Regular (12\")",
                  "price": 0
                },
                {
                  "id": "choice_123456790",
                  "name": "Large (16\")",
                  "price": 4.00
                }
              ]
            },
            {
              "id": "opt_123456790",
              "name": "Extra Toppings",
              "required": false,
              "multiple": true,
              "options": [
                {
                  "id": "choice_123456791",
                  "name": "Mushrooms",
                  "price": 1.50
                },
                {
                  "id": "choice_123456792",
                  "name": "Pepperoni",
                  "price": 2.00
                }
              ]
            }
          ],
          "availability": true,
          "popularity": 95
        }
      ]
    },
    {
      "id": "cat_123456790",
      "name": "Pasta",
      "description": "Homemade pasta dishes",
      "items": [
        {
          "id": "item_123456790",
          "name": "Spaghetti Carbonara",
          "description": "Pancetta, egg, parmesan, black pepper",
          "price": 14.99,
          "image_url": "https://assets.eatsome.com/restaurants/rest_123456789/items/carbonara.jpg",
          "calories": 950,
          "dietary_info": [],
          "customization_options": [],
          "availability": true,
          "popularity": 85
        }
      ]
    }
  ]
}
```

### 4.4 Get Restaurant Reviews

**Endpoint:** `GET /restaurants/{restaurant_id}/reviews`

**URL Parameters:**
- `restaurant_id`: The ID of the restaurant

**Query Parameters:**
- `rating`: Filter by rating (1-5)
- `sort`: Sort order (options: newest, highest_rating, lowest_rating)

**Response:** `200 OK`
```json
{
  "data": [
    {
      "id": "rev_123456789",
      "rating": 5,
      "comment": "Amazing pizza! Best I've had in the city.",
      "created_at": "2023-01-10T18:30:00Z",
      "user": {
        "id": "usr_123456789",
        "name": "John D.",
        "avatar_url": "https://assets.eatsome.com/avatars/usr_123456789.jpg"
      },
      "photos": [
        "https://assets.eatsome.com/reviews/rev_123456789/photo1.jpg"
      ],
      "order_verified": true
    }
  ],
  "pagination": {
    "total": 243,
    "limit": 20,
    "offset": 0,
    "has_more": true,
    "next_cursor": "Y3Vyc29yXzE2MTIzNDU2Nzg="
  },
  "summary": {
    "average_rating": 4.7,
    "total_reviews": 243,
    "rating_breakdown": {
      "5": 180,
      "4": 42,
      "3": 15,
      "2": 4,
      "1": 2
    }
  }
}
```

### 4.5 Create Restaurant Review

**Endpoint:** `POST /restaurants/{restaurant_id}/reviews`

**Headers:**
- `Authorization: Bearer {jwt_token}`

**URL Parameters:**
- `restaurant_id`: The ID of the restaurant

**Request Body:**
```json
{
  "rating": 5,
  "comment": "Amazing pizza! Best I've had in the city.",
  "order_id": "ord_123456789",
  "photos": [
    {
      "data": "base64_encoded_image_data",
      "type": "image/jpeg"
    }
  ]
}
```

**Response:** `201 Created`
```json
{
  "id": "rev_123456789",
  "rating": 5,
  "comment": "Amazing pizza! Best I've had in the city.",
  "created_at": "2023-01-15T18:30:00Z",
  "user": {
    "id": "usr_123456789",
    "name": "John D.",
    "avatar_url": "https://assets.eatsome.com/avatars/usr_123456789.jpg"
  },
  "photos": [
    "https://assets.eatsome.com/reviews/rev_123456789/photo1.jpg"
  ],
  "order_verified": true
}
```

## 5. Order API

### 5.1 Create Order

**Endpoint:** `POST /orders`

**Headers:**
- `Authorization: Bearer {jwt_token}`

**Request Body:**
```json
{
  "restaurant_id": "rest_123456789",
  "delivery_type": "DELIVERY",
  "address_id": "addr_987654321",
  "items": [
    {
      "item_id": "item_123456789",
      "quantity": 1,
      "special_instructions": "Extra crispy crust please",
      "customizations": [
        {
          "option_id": "opt_123456789",
          "choice_ids": ["choice_123456790"]
        },
        {
          "option_id": "opt_123456790",
          "choice_ids": ["choice_123456791", "choice_123456792"]
        }
      ]
    },
    {
      "item_id": "item_987654321",
      "quantity": 2,
      "special_instructions": null,
      "customizations": []
    }
  ],
  "payment_method_id": "pm_123456789",
  "promo_code": "WELCOME10",
  "scheduled_time": null,
  "special_instructions": "Please ring doorbell upon arrival",
  "utensils_required": true
}
```

**Response:** `201 Created`
```json
{
  "id": "ord_987654321",
  "status": "PENDING",
  "created_at": "2023-01-15T19:00:00Z",
  "restaurant": {
    "id": "rest_123456789",
    "name": "Pizza Palace",
    "logo_url": "https://assets.eatsome.com/restaurants/rest_123456789/logo.jpg"
  },
  "delivery_type": "DELIVERY",
  "delivery_address": {
    "id": "addr_987654321",
    "recipient_name": "John Doe",
    "street": "123 Main St",
    "apt_suite": "Apt 4B",
    "city": "New York",
    "state": "NY",
    "postal_code": "10001",
    "country": "US",
    "delivery_instructions": "Leave with doorman"
  },
  "items": [
    {
      "id": "orditem_123456789",
      "name": "Margherita - Large (16\")",
      "quantity": 1,
      "unit_price": 16.99,
      "total_price": 20.49,
      "special_instructions": "Extra crispy crust please",
      "customizations": [
        {
          "name": "Size",
          "choice": "Large (16\")",
          "price": 4.00
        },
        {
          "name": "Extra Toppings",
          "choice": "Mushrooms, Pepperoni",
          "price": 3.50
        }
      ]
    },
    {
      "id": "orditem_123456790",
      "name": "Garlic Knots",
      "quantity": 2,
      "unit_price": 4.99,
      "total_price": 9.98,
      "special_instructions": null,
      "customizations": []
    }
  ],
  "subtotal": 30.47,
  "tax": 2.74,
  "delivery_fee": 2.99,
  "tip": 0,
  "promo_discount": -3.05,
  "total": 33.15,
  "payment_method": {
    "id": "pm_123456789",
    "type": "card",
    "brand": "visa",
    "last4": "4242"
  },
  "special_instructions": "Please ring doorbell upon arrival",
  "utensils_required": true,
  "estimated_delivery_time": "19:25 - 19:35",
  "courier": null,
  "tracking_url": "https://eatsome.com/track/ord_987654321"
}
```

### 5.2 Get Order

**Endpoint:** `GET /orders/{order_id}`

**Headers:**
- `Authorization: Bearer {jwt_token}`

**URL Parameters:**
- `order_id`: The ID of the order

**Response:** `200 OK`
```json
{
  "id": "ord_987654321",
  "status": "PREPARING",
  "created_at": "2023-01-15T19:00:00Z",
  "updated_at": "2023-01-15T19:05:00Z",
  "restaurant": {
    "id": "rest_123456789",
    "name": "Pizza Palace",
    "logo_url": "https://assets.eatsome.com/restaurants/rest_123456789/logo.jpg",
    "phone": "+12125556789"
  },
  "delivery_type": "DELIVERY",
  "delivery_address": {
    "id": "addr_987654321",
    "recipient_name": "John Doe",
    "street": "123 Main St",
    "apt_suite": "Apt 4B",
    "city": "New York",
    "state": "NY",
    "postal_code": "10001",
    "country": "US",
    "delivery_instructions": "Leave with doorman"
  },
  "items": [
    {
      "id": "orditem_123456789",
      "name": "Margherita - Large (16\")",
      "quantity": 1,
      "unit_price": 16.99,
      "total_price": 20.49,
      "special_instructions": "Extra crispy crust please",
      "customizations": [
        {
          "name": "Size",
          "choice": "Large (16\")",
          "price": 4.00
        },
        {
          "name": "Extra Toppings",
          "choice": "Mushrooms, Pepperoni",
          "price": 3.50
        }
      ]
    },
    {
      "id": "orditem_123456790",
      "name": "Garlic Knots",
      "quantity": 2,
      "unit_price": 4.99,
      "total_price": 9.98,
      "special_instructions": null,
      "customizations": []
    }
  ],
  "subtotal": 30.47,
  "tax": 2.74,
  "delivery_fee": 2.99,
  "tip": 5.00,
  "promo_discount": -3.05,
  "total": 38.15,
  "payment_method": {
    "id": "pm_123456789",
    "type": "card",
    "brand": "visa",
    "last4": "4242"
  },
  "special_instructions": "Please ring doorbell upon arrival",
  "utensils_required": true,
  "estimated_delivery_time": "19:25 - 19:35",
  "courier": {
    "id": "courier_123456789",
    "name": "Michael S.",
    "phone": "+12125557890",
    "photo_url": "https://assets.eatsome.com/couriers/courier_123456789.jpg",
    "location": {
      "latitude": 40.7128,
      "longitude": -74.0060,
      "last_updated": "2023-01-15T19:20:00Z"
    }
  },
  "timeline": [
    {
      "status": "PENDING",
      "timestamp": "2023-01-15T19:00:00Z"
    },
    {
      "status": "CONFIRMED",
      "timestamp": "2023-01-15T19:02:00Z"
    },
    {
      "status": "PREPARING",
      "timestamp": "2023-01-15T19:05:00Z"
    }
  ],
  "tracking_url": "https://eatsome.com/track/ord_987654321"
}
```

### 5.3 List User Orders

**Endpoint:** `GET /users/me/orders`

**Headers:**
- `Authorization: Bearer {jwt_token}`

**Query Parameters:**
- `status`: Filter by order status
- `sort`: Sort order (options: newest, oldest)
- `limit`: Number of items per page
- `offset`: Pagination offset

**Response:** `200 OK`
```json
{
  "data": [
    {
      "id": "ord_987654321",
      "status": "DELIVERED",
      "created_at": "2023-01-15T19:00:00Z",
      "restaurant": {
        "id": "rest_123456789",
        "name": "Pizza Palace",
        "logo_url": "https://assets.eatsome.com/restaurants/rest_123456789/logo.jpg"
      },
      "delivery_type": "DELIVERY",
      "items_summary": "1x Margherita - Large (16\"), 2x Garlic Knots",
      "total": 38.15,
      "rating": 5
    },
    {
      "id": "ord_987654322",
      "status": "PREPARING",
      "created_at": "2023-01-17T12:30:00Z",
      "restaurant": {
        "id": "rest_987654321",
        "name": "Sushi Express",
        "logo_url": "https://assets.eatsome.com/restaurants/rest_987654321/logo.jpg"
      },
      "delivery_type": "PICKUP",
      "items_summary": "1x California Roll, 1x Miso Soup",
      "total": 21.45,
      "rating": null
    }
  ],
  "pagination": {
    "total": 12,
    "limit": 20,
    "offset": 0,
    "has_more": false
  }
}
```

### 5.4 Update Order (Add Tip)

**Endpoint:** `PATCH /orders/{order_id}`

**Headers:**
- `Authorization: Bearer {jwt_token}`

**URL Parameters:**
- `order_id`: The ID of the order

**Request Body:**
```json
{
  "tip": 5.00
}
```

**Response:** `200 OK`
```json
{
  "id": "ord_987654321",
  "status": "PREPARING",
  "subtotal": 30.47,
  "tax": 2.74,
  "delivery_fee": 2.99,
  "tip": 5.00,
  "promo_discount": -3.05,
  "total": 38.15
}
```

### 5.5 Cancel Order

**Endpoint:** `POST /orders/{order_id}/cancel`

**Headers:**
- `Authorization: Bearer {jwt_token}`

**URL Parameters:**
- `order_id`: The ID of the order

**Request Body:**
```json
{
  "reason": "Changed my mind",
  "details": "Decided to order something else"
}
```

**Response:** `200 OK`
```json
{
  "id": "ord_987654321",
  "status": "CANCELLED",
  "cancellation": {
    "cancelled_at": "2023-01-15T19:10:00Z",
    "reason": "Changed my mind",
    "details": "Decided to order something else",
    "refund_amount": 38.15,
    "refund_status": "PENDING"
  }
}
```

## 6. Restaurant Management API

### 6.1 Get Restaurant Dashboard (Admin)

**Endpoint:** `GET /admin/restaurants/{restaurant_id}/dashboard`

**Headers:**
- `Authorization: Bearer {jwt_token}` (Admin or restaurant owner token)

**URL Parameters:**
- `restaurant_id`: The ID of the restaurant

**Query Parameters:**
- `period`: Time period for metrics (options: today, week, month, year)

**Response:** `200 OK`
```json
{
  "restaurant": {
    "id": "rest_123456789",
    "name": "Pizza Palace",
    "status": "ACTIVE",
    "online_status": "ONLINE"
  },
  "summary": {
    "revenue": {
      "value": 2456.50,
      "change": 12.5
    },
    "orders": {
      "value": 124,
      "change": 8.2
    },
    "customers": {
      "value": 78,
      "change": 5.1
    },
    "average_order_value": {
      "value": 19.81,
      "change": 3.9
    }
  },
  "orders": {
    "total": 124,
    "breakdown": {
      "DELIVERY": 86,
      "PICKUP": 28,
      "DINE_IN": 10
    },
    "status_breakdown": {
      "COMPLETED": 110,
      "CANCELLED": 8,
      "REFUNDED": 6
    }
  },
  "peak_hours": [
    {
      "hour": 12,
      "orders": 18
    },
    {
      "hour": 18,
      "orders": 24
    },
    {
      "hour": 19,
      "orders": 30
    }
  ],
  "top_items": [
    {
      "id": "item_123456789",
      "name": "Margherita",
      "quantity": 45,
      "revenue": 584.55
    },
    {
      "id": "item_123456790",
      "name": "Pepperoni Pizza",
      "quantity": 38,
      "revenue": 532.00
    }
  ],
  "recent_reviews": [
    {
      "id": "rev_123456789",
      "rating": 5,
      "comment": "Amazing pizza! Best I've had in the city.",
      "created_at": "2023-01-15T18:30:00Z"
    }
  ]
}
```

### 6.2 Get Active Orders (Staff)

**Endpoint:** `GET /staff/restaurants/{restaurant_id}/orders`

**Headers:**
- `Authorization: Bearer {jwt_token}` (Staff token)

**URL Parameters:**
- `restaurant_id`: The ID of the restaurant

**Query Parameters:**
- `status`: Filter by order status (comma-separated list)
- `sort`: Sort order (options: newest, oldest)

**Response:** `200 OK`
```json
{
  "data": [
    {
      "id": "ord_987654321",
      "status": "PENDING",
      "created_at": "2023-01-15T19:00:00Z",
      "delivery_type": "DELIVERY",
      "customer": {
        "name": "John D.",
        "phone": "+1234567890"
      },
      "items": [
        {
          "name": "Margherita - Large (16\")",
          "quantity": 1,
          "special_instructions": "Extra crispy crust please",
          "customizations": "Size: Large (16\"), Extra Toppings: Mushrooms, Pepperoni"
        },
        {
          "name": "Garlic Knots",
          "quantity": 2,
          "special_instructions": null,
          "customizations": ""
        }
      ],
      "total": 38.15,
      "special_instructions": "Please ring doorbell upon arrival",
      "estimated_ready_time": "2023-01-15T19:20:00Z"
    }
  ],
  "summary": {
    "PENDING": 3,
    "PREPARING": 5,
    "READY": 2,
    "IN_DELIVERY": 4
  }
}
```

### 6.3 Update Order Status (Staff)

**Endpoint:** `POST /staff/restaurants/{restaurant_id}/orders/{order_id}/status`

**Headers:**
- `Authorization: Bearer {jwt_token}` (Staff token)

**URL Parameters:**
- `restaurant_id`: The ID of the restaurant
- `order_id`: The ID of the order

**Request Body:**
```json
{
  "status": "PREPARING",
  "estimated_ready_time": "2023-01-15T19:20:00Z"
}
```

**Response:** `200 OK`
```json
{
  "id": "ord_987654321",
  "status": "PREPARING",
  "updated_at": "2023-01-15T19:05:00Z",
  "estimated_ready_time": "2023-01-15T19:20:00Z"
}
```

### 6.4 Get Menu Items (Admin)

**Endpoint:** `GET /admin/restaurants/{restaurant_id}/menu-items`

**Headers:**
- `Authorization: Bearer {jwt_token}` (Admin token)

**URL Parameters:**
- `restaurant_id`: The ID of the restaurant

**Query Parameters:**
- `category_id`: Filter by category ID
- `availability`: Filter by availability (true/false)

**Response:** `200 OK`
```json
{
  "data": [
    {
      "id": "item_123456789",
      "name": "Margherita",
      "description": "Tomato sauce, fresh mozzarella, basil",
      "price": 12.99,
      "category_id": "cat_123456789",
      "image_url": "https://assets.eatsome.com/restaurants/rest_123456789/items/margherita.jpg",
      "calories": 850,
      "dietary_info": ["Vegetarian"],
      "customization_options": [
        {
          "id": "opt_123456789",
          "name": "Size",
          "required": true,
          "multiple": false,
          "options": [
            {
              "id": "choice_123456789",
              "name": "Regular (12\")",
              "price": 0
            },
            {
              "id": "choice_123456790",
              "name": "Large (16\")",
              "price": 4.00
            }
          ]
        }
      ],
      "availability": true,
      "popularity": 95,
      "created_at": "2022-12-01T10:00:00Z",
      "updated_at": "2023-01-10T14:30:00Z"
    }
  ],
  "pagination": {
    "total": 24,
    "limit": 20,
    "offset": 0,
    "has_more": true
  }
}
```

### 6.5 Create Menu Item (Admin)

**Endpoint:** `POST /admin/restaurants/{restaurant_id}/menu-items`

**Headers:**
- `Authorization: Bearer {jwt_token}` (Admin token)

**URL Parameters:**
- `restaurant_id`: The ID of the restaurant

**Request Body:**
```json
{
  "name": "Hawaiian Pizza",
  "description": "Tomato sauce, mozzarella, ham, pineapple",
  "price": 14.99,
  "category_id": "cat_123456789",
  "image": {
    "data": "base64_encoded_image_data",
    "type": "image/jpeg"
  },
  "calories": 900,
  "dietary_info": [],
  "customization_options": [
    {
      "name": "Size",
      "required": true,
      "multiple": false,
      "options": [
        {
          "name": "Regular (12\")",
          "price": 0
        },
        {
          "name": "Large (16\")",
          "price": 4.00
        }
      ]
    }
  ],
  "availability": true
}
```

**Response:** `201 Created`
```json
{
  "id": "item_123456790",
  "name": "Hawaiian Pizza",
  "description": "Tomato sauce, mozzarella, ham, pineapple",
  "price": 14.99,
  "category_id": "cat_123456789",
  "image_url": "https://assets.eatsome.com/restaurants/rest_123456789/items/hawaiian.jpg",
  "calories": 900,
  "dietary_info": [],
  "customization_options": [
    {
      "id": "opt_123456791",
      "name": "Size",
      "required": true,
      "multiple": false,
      "options": [
        {
          "id": "choice_123456793",
          "name": "Regular (12\")",
          "price": 0
        },
        {
          "id": "choice_123456794",
          "name": "Large (16\")",
          "price": 4.00
        }
      ]
    }
  ],
  "availability": true,
  "popularity": 0,
  "created_at": "2023-01-15T20:00:00Z",
  "updated_at": "2023-01-15T20:00:00Z"
}
```

### 6.6 Update Menu Item (Admin)

**Endpoint:** `PATCH /admin/restaurants/{restaurant_id}/menu-items/{item_id}`

**Headers:**
- `Authorization: Bearer {jwt_token}` (Admin token)

**URL Parameters:**
- `restaurant_id`: The ID of the restaurant
- `item_id`: The ID of the menu item

**Request Body:**
```json
{
  "price": 15.99,
  "availability": false,
  "customization_options": [
    {
      "id": "opt_123456791",
      "options": [
        {
          "id": "choice_123456793",
          "price": 0
        },
        {
          "id": "choice_123456794",
          "price": 5.00
        }
      ]
    }
  ]
}
```

**Response:** `200 OK`
```json
{
  "id": "item_123456790",
  "name": "Hawaiian Pizza",
  "description": "Tomato sauce, mozzarella, ham, pineapple",
  "price": 15.99,
  "category_id": "cat_123456789",
  "image_url": "https://assets.eatsome.com/restaurants/rest_123456789/items/hawaiian.jpg",
  "calories": 900,
  "dietary_info": [],
  "customization_options": [
    {
      "id": "opt_123456791",
      "name": "Size",
      "required": true,
      "multiple": false,
      "options": [
        {
          "id": "choice_123456793",
          "name": "Regular (12\")",
          "price": 0
        },
        {
          "id": "choice_123456794",
          "name": "Large (16\")",
          "price": 5.00
        }
      ]
    }
  ],
  "availability": false,
  "popularity": 0,
  "created_at": "2023-01-15T20:00:00Z",
  "updated_at": "2023-01-15T20:30:00Z"
}
```

### 6.7 Get Tables (Staff)

**Endpoint:** `GET /staff/restaurants/{restaurant_id}/tables`

**Headers:**
- `Authorization: Bearer {jwt_token}` (Staff token)

**URL Parameters:**
- `restaurant_id`: The ID of the restaurant

**Query Parameters:**
- `status`: Filter by table status

**Response:** `200 OK`
```json
{
  "data": [
    {
      "id": "table_123456789",
      "name": "T1",
      "seats": 4,
      "status": "OCCUPIED",
      "current_order": {
        "id": "ord_123456789",
        "status": "SERVING",
        "created_at": "2023-01-15T19:30:00Z",
        "items_summary": "1x Margherita, 2x Garlic Knots"
      },
      "occupied_since": "2023-01-15T19:25:00Z",
      "estimated_completion": "2023-01-15T20:45:00Z",
      "section": "Main Floor"
    },
    {
      "id": "table_123456790",
      "name": "T2",
      "seats": 2,
      "status": "AVAILABLE",
      "current_order": null,
      "occupied_since": null,
      "estimated_completion": null,
      "section": "Main Floor"
    },
    {
      "id": "table_123456791",
      "name": "T3",
      "seats": 6,
      "status": "RESERVED",
      "current_order": null,
      "occupied_since": null,
      "estimated_completion": null,
      "section": "Main Floor",
      "reservation": {
        "id": "res_123456789",
        "customer_name": "Sarah Johnson",
        "party_size": 5,
        "time": "2023-01-15T20:00:00Z",
        "special_requests": "Birthday celebration"
      }
    }
  ],
  "summary": {
    "total_tables": 15,
    "available": 8,
    "occupied": 5,
    "reserved": 2
  }
}
```

### 6.8 Update Table Status (Staff)

**Endpoint:** `PATCH /staff/restaurants/{restaurant_id}/tables/{table_id}`

**Headers:**
- `Authorization: Bearer {jwt_token}` (Staff token)

**URL Parameters:**
- `restaurant_id`: The ID of the restaurant
- `table_id`: The ID of the table

**Request Body:**
```json
{
  "status": "OCCUPIED",
  "party_size": 3
}
```

**Response:** `200 OK`
```json
{
  "id": "table_123456790",
  "name": "T2",
  "seats": 2,
  "status": "OCCUPIED",
  "current_order": null,
  "occupied_since": "2023-01-15T20:15:00Z",
  "estimated_completion": null,
  "section": "Main Floor",
  "party_size": 3
}
```

## 7. Courier API

### 7.1 Get Available Deliveries

**Endpoint:** `GET /courier/deliveries/available`

**Headers:**
- `Authorization: Bearer {jwt_token}` (Courier token)

**Query Parameters:**
- `latitude`: Courier's current latitude
- `longitude`: Courier's current longitude
- `radius`: Search radius in kilometers (default: 5)

**Response:** `200 OK`
```json
{
  "data": [
    {
      "id": "del_123456789",
      "order_id": "ord_987654321",
      "restaurant": {
        "id": "rest_123456789",
        "name": "Pizza Palace",
        "address": {
          "street": "123 Pizza St",
          "city": "New York",
          "state": "NY",
          "postal_code": "10001",
          "latitude": 40.7128,
          "longitude": -74.0060
        }
      },
      "customer_location": {
        "address": {
          "street": "123 Main St",
          "city": "New York",
          "state": "NY",
          "postal_code": "10001"
        },
        "latitude": 40.7200,
        "longitude": -74.0100
      },
      "distance_to_restaurant": 1.2,
      "distance_to_customer": 0.8,
      "total_distance": 2.0,
      "estimated_earnings": {
        "base": 5.00,
        "distance": 2.00,
        "time": 1.50,
        "estimated_total": 8.50,
        "estimated_tip": "3.00-5.00"
      },
      "estimated_ready_time": "2023-01-15T19:20:00Z",
      "expires_at": "2023-01-15T19:05:00Z"
    }
  ]
}
```

### 7.2 Accept Delivery

**Endpoint:** `POST /courier/deliveries/{delivery_id}/accept`

**Headers:**
- `Authorization: Bearer {jwt_token}` (Courier token)

**URL Parameters:**
- `delivery_id`: The ID of the delivery

**Response:** `200 OK`
```json
{
  "id": "del_123456789",
  "status": "ACCEPTED",
  "order_id": "ord_987654321",
  "restaurant": {
    "id": "rest_123456789",
    "name": "Pizza Palace",
    "phone": "+12125556789",
    "address": {
      "street": "123 Pizza St",
      "city": "New York",
      "state": "NY",
      "postal_code": "10001",
      "latitude": 40.7128,
      "longitude": -74.0060
    },
    "instructions": "Enter through side door, ask for manager"
  },
  "customer": {
    "name": "John D.",
    "phone": "+1234567890",
    "address": {
      "street": "123 Main St",
      "apt_suite": "Apt 4B",
      "city": "New York",
      "state": "NY",
      "postal_code": "10001",
      "latitude": 40.7200,
      "longitude": -74.0100,
      "delivery_instructions": "Leave with doorman"
    }
  },
  "items_summary": "1x Margherita - Large (16\"), 2x Garlic Knots",
  "estimated_ready_time": "2023-01-15T19:20:00Z",
  "navigation": {
    "to_restaurant": {
      "url": "https://maps.google.com/?q=40.7128,-74.0060",
      "distance": 1.2,
      "estimated_time": 5
    },
    "to_customer": {
      "url": "https://maps.google.com/?q=40.7200,-74.0100",
      "distance": 0.8,
      "estimated_time": 4
    }
  }
}
```

### 7.3 Update Delivery Status

**Endpoint:** `POST /courier/deliveries/{delivery_id}/status`

**Headers:**
- `Authorization: Bearer {jwt_token}` (Courier token)

**URL Parameters:**
- `delivery_id`: The ID of the delivery

**Request Body:**
```json
{
  "status": "PICKED_UP",
  "location": {
    "latitude": 40.7128,
    "longitude": -74.0060
  }
}
```

**Response:** `200 OK`
```json
{
  "id": "del_123456789",
  "status": "PICKED_UP",
  "updated_at": "2023-01-15T19:25:00Z",
  "estimated_delivery_time": "2023-01-15T19:35:00Z"
}
```

### 7.4 Complete Delivery

**Endpoint:** `POST /courier/deliveries/{delivery_id}/complete`

**Headers:**
- `Authorization: Bearer {jwt_token}` (Courier token)

**URL Parameters:**
- `delivery_id`: The ID of the delivery

**Request Body:**
```json
{
  "location": {
    "latitude": 40.7200,
    "longitude": -74.0100
  },
  "photo_proof": {
    "data": "base64_encoded_image_data",
    "type": "image/jpeg"
  },
  "delivery_notes": "Left with doorman as requested"
}
```

**Response:** `200 OK`
```json
{
  "id": "del_123456789",
  "status": "COMPLETED",
  "completed_at": "2023-01-15T19:32:00Z",
  "earnings": {
    "base": 5.00,
    "distance": 2.00,
    "time": 1.50,
    "tip": 5.00,
    "total": 13.50
  }
}
```

### 7.5 Get Courier Earnings

**Endpoint:** `GET /courier/earnings`

**Headers:**
- `Authorization: Bearer {jwt_token}` (Courier token)

**Query Parameters:**
- `period`: Time period (options: today, week, month)
- `start_date`: Custom start date (format: YYYY-MM-DD)
- `end_date`: Custom end date (format: YYYY-MM-DD)

**Response:** `200 OK`
```json
{
  "period": "week",
  "start_date": "2023-01-09",
  "end_date": "2023-01-15",
  "summary": {
    "total_earnings": 416.25,
    "deliveries": 32,
    "online_hours": 24.5,
    "average_per_delivery": 13.01,
    "average_per_hour": 16.99
  },
  "breakdown": {
    "base": 162.50,
    "distance": 64.75,
    "time": 49.00,
    "tips": 140.00
  },
  "daily": [
    {
      "date": "2023-01-09",
      "earnings": 65.75,
      "deliveries": 5
    },
    {
      "date": "2023-01-10",
      "earnings": 52.50,
      "deliveries": 4
    }
  ],
  "next_payout": {
    "date": "2023-01-16",
    "amount": 416.25,
    "method": "Direct Deposit"
  }
}
```

## 8. Real-time API

### 8.1 WebSocket Connection

**WebSocket URL:**
```
wss://realtime.eatsome.com/v1/ws?token={jwt_token}
```

### 8.2 Subscribe to Order Updates

**Client Message:**
```json
{
  "type": "subscribe",
  "channel": "order_updates",
  "order_id": "ord_987654321"
}
```

**Server Message (Order Status Update):**
```json
{
  "type": "order_update",
  "order_id": "ord_987654321",
  "status": "PREPARING",
  "timestamp": "2023-01-15T19:05:00Z",
  "estimated_ready_time": "2023-01-15T19:20:00Z"
}
```

**Server Message (Courier Assignment):**
```json
{
  "type": "courier_assigned",
  "order_id": "ord_987654321",
  "courier": {
    "id": "courier_123456789",
    "name": "Michael S.",
    "photo_url": "https://assets.eatsome.com/couriers/courier_123456789.jpg",
    "rating": 4.9
  },
  "timestamp": "2023-01-15T19:22:00Z",
  "estimated_delivery_time": "2023-01-15T19:35:00Z"
}
```

### 8.3 Subscribe to Courier Location Updates

**Client Message:**
```json
{
  "type": "subscribe",
  "channel": "courier_location",
  "order_id": "ord_987654321"
}
```

**Server Message (Location Update):**
```json
{
  "type": "location_update",
  "order_id": "ord_987654321",
  "courier_id": "courier_123456789",
  "location": {
    "latitude": 40.7150,
    "longitude": -74.0080
  },
  "timestamp": "2023-01-15T19:27:30Z",
  "route_progress": 0.65,
  "estimated_arrival": "2023-01-15T19:31:00Z"
}
```

### 8.4 Subscribe to Restaurant New Orders (Staff)

**Client Message:**
```json
{
  "type": "subscribe",
  "channel": "restaurant_orders",
  "restaurant_id": "rest_123456789"
}
```

**Server Message (New Order):**
```json
{
  "type": "new_order",
  "restaurant_id": "rest_123456789",
  "order": {
    "id": "ord_987654322",
    "status": "PENDING",
    "created_at": "2023-01-15T20:00:00Z",
    "delivery_type": "DELIVERY",
    "items_summary": "1x Pepperoni Pizza, 1x Caesar Salad",
    "total": 28.45
  }
}
```

### 8.5 Send Courier Message

**Client Message:**
```json
{
  "type": "send_message",
  "channel": "order_chat",
  "order_id": "ord_987654321",
  "message": "I'm outside your building now."
}
```

**Server Message (Chat Message):**
```json
{
  "type": "chat_message",
  "order_id": "ord_987654321",
  "sender": {
    "id": "courier_123456789",
    "name": "Michael S.",
    "role": "COURIER"
  },
  "message": "I'm outside your building now.",
  "timestamp": "2023-01-15T19:30:00Z"
}
```

## 9. Webhook API

### 9.1 Stripe Webhook

**Endpoint:** `POST /webhooks/stripe`

**Headers:**
- `Stripe-Signature: {signature}`

**Request Body:**
```json
{
  "id": "evt_123456789",
  "type": "payment_intent.succeeded",
  "data": {
    "object": {
      "id": "pi_123456789",
      "amount": 3815,
      "currency": "usd",
      "metadata": {
        "order_id": "ord_987654321"
      }
    }
  }
}
```

**Response:** `200 OK`
```json
{
  "received": true
}
```

### 9.2 Register Webhook

**Endpoint:** `POST /admin/webhooks`

**Headers:**
- `Authorization: Bearer {jwt_token}` (Admin token)

**Request Body:**
```json
{
  "url": "https://example.com/webhook",
  "events": ["order.created", "order.updated", "order.completed"],
  "secret": "whsec_123456789"
}
```

**Response:** `201 Created`
```json
{
  "id": "wh_123456789",
  "url": "https://example.com/webhook",
  "events": ["order.created", "order.updated", "order.completed"],
  "created_at": "2023-01-15T20:00:00Z"
}
```

### 9.3 Sample Webhook Payload (Order Updated)

**Webhook Request:**
```json
{
  "id": "evt_123456789",
  "type": "order.updated",
  "created_at": "2023-01-15T19:05:00Z",
  "data": {
    "order": {
      "id": "ord_987654321",
      "status": "PREPARING",
      "updated_at": "2023-01-15T19:05:00Z",
      "estimated_ready_time": "2023-01-15T19:20:00Z"
    }
  }
}
```

## 10. Admin API

### 10.1 Get Platform Stats

**Endpoint:** `GET /admin/platform/stats`

**Headers:**
- `Authorization: Bearer {jwt_token}` (Platform Admin token)

**Query Parameters:**
- `period`: Time period (options: today, week, month, year)

**Response:** `200 OK`
```json
{
  "period": "month",
  "orders": {
    "total": 15423,
    "completed": 14802,
    "cancelled": 621,
    "growth": 8.4
  },
  "users": {
    "total": 45628,
    "active": 18453,
    "new": 2145,
    "growth": 4.7
  },
  "restaurants": {
    "total": 387,
    "active": 352,
    "new": 24,
    "growth": 6.2
  },
  "revenue": {
    "total": 654280.45,
    "platform_fees": 98142.06,
    "delivery_fees": 46124.80,
    "growth": 12.3
  },
  "performance": {
    "average_delivery_time": 28.4,
    "average_preparation_time": 18.6,
    "order_success_rate": 96.4,
    "system_uptime": 99.98
  }
}
```

### 10.2 Get Restaurant Approval Queue

**Endpoint:** `GET /admin/restaurants/approval-queue`

**Headers:**
- `Authorization: Bearer {jwt_token}` (Platform Admin token)

**Query Parameters:**
- `status`: Filter by approval status (options: pending, approved, rejected)
- `sort`: Sort order (options: newest, oldest)

**Response:** `200 OK`
```json
{
  "data": [
    {
      "id": "rest_123456789",
      "name": "Burger Bistro",
      "owner": {
        "id": "usr_123456789",
        "name": "Jane Smith",
        "email": "jane@burgerbistro.com"
      },
      "address": {
        "street": "456 Burger Ave",
        "city": "Chicago",
        "state": "IL",
        "postal_code": "60601"
      },
      "cuisine": ["American", "Burgers"],
      "submitted_at": "2023-01-14T15:30:00Z",
      "status": "PENDING",
      "documents": [
        {
          "type": "BUSINESS_LICENSE",
          "url": "https://assets.eatsome.com/restaurants/rest_123456789/license.pdf",
          "status": "VERIFIED"
        },
        {
          "type": "FOOD_PERMIT",
          "url": "https://assets.eatsome.com/restaurants/rest_123456789/permit.pdf",
          "status": "PENDING"
        }
      ]
    }
  ],
  "pagination": {
    "total": 14,
    "limit": 20,
    "offset": 0,
    "has_more": false
  },
  "summary": {
    "pending": 8,
    "approved_today": 3,
    "rejected_today": 1
  }
}
```

### 10.3 Approve Restaurant

**Endpoint:** `POST /admin/restaurants/{restaurant_id}/approve`

**Headers:**
- `Authorization: Bearer {jwt_token}` (Platform Admin token)

**URL Parameters:**
- `restaurant_id`: The ID of the restaurant

**Request Body:**
```json
{
  "commission_rate": 15.0,
  "notes": "Welcome package prepared, all documents verified"
}
```

**Response:** `200 OK`
```json
{
  "id": "rest_123456789",
  "status": "ACTIVE",
  "approved_at": "2023-01-15T14:30:00Z",
  "commission_rate": 15.0,
  "onboarding_status": "WELCOME_EMAIL_SENT"
}
```

### 10.4 Get User Details (Admin)

**Endpoint:** `GET /admin/users/{user_id}`

**Headers:**
- `Authorization: Bearer {jwt_token}` (Platform Admin token)

**URL Parameters:**
- `user_id`: The ID of the user

**Response:** `200 OK`
```json
{
  "id": "usr_123456789",
  "email": "john@example.com",
  "name": "John Doe",
  "phone": "+1234567890",
  "created_at": "2023-01-01T10:00:00Z",
  "status": "ACTIVE",
  "role": "CUSTOMER",
  "orders": {
    "total": 24,
    "completed": 23,
    "cancelled": 1,
    "total_spent": 578.45,
    "average_order": 24.10
  },
  "addresses": [
    {
      "id": "addr_987654321",
      "label": "Home",
      "street": "123 Main St",
      "city": "New York",
      "state": "NY",
      "postal_code": "10001"
    }
  ],
  "payment_methods": [
    {
      "id": "pm_123456789",
      "type": "card",
      "brand": "visa",
      "last4": "4242",
      "exp_month": 12,
      "exp_year": 2025
    }
  ],
  "activity": [
    {
      "type": "ORDER",
      "id": "ord_987654321",
      "timestamp": "2023-01-15T19:00:00Z",
      "details": "Order placed - $38.15"
    },
    {
      "type": "ACCOUNT",
      "timestamp": "2023-01-10T14:20:00Z",
      "details": "Added payment method"
    }
  ]
}
```

This API specification provides a comprehensive overview of the endpoints and data structures for the All-in-One Food Platform. It covers all major functionality required by the various user types and applications within the platform.
