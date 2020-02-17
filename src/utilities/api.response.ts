export function convertApiResponse(status?: boolean, data?: any, message?: string) {
  return {
    status: status ? true : false,
    data: data,
    message: message ? message : ""
  }
}