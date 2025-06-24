class ApiResponse {
    constructor(statusCode, message = "Success", data = null) {
        this.statusCode = statusCode; // HTTP status code
        this.message = message; // Response message
        this.data = data; // Optional data payload
        this.success = statusCode< 400; // Success flag based on status code, we try keep it below 400 for our safety
    }
}

export {ApiResponse}