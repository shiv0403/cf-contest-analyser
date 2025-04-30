/* eslint-disable @typescript-eslint/no-explicit-any */
interface SuccessResponse<T> {
  success: true;
  data: T;
  message?: string;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    [key: string]: any;
  };
}

export const createSuccessResponse = <T>(
  data: T,
  message?: string,
  meta?: SuccessResponse<T>["meta"]
): SuccessResponse<T> => {
  return {
    success: true,
    data,
    ...(message && { message }),
    ...(meta && { meta }),
  };
};

export const sendSuccessResponse = <T>(
  data: T,
  message?: string,
  meta?: SuccessResponse<T>["meta"],
  status: number = 200
) => {
  const response = createSuccessResponse(data, message, meta);
  return new Response(JSON.stringify(response), {
    status,
    headers: {
      "Content-Type": "application/json",
    },
  });
};
