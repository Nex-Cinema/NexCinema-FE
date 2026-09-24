export const ADMIN_API_PAGE_SIZE = 100;

export const asCollection = (response, resourceName = 'dữ liệu') => {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.data)) return response.data;

  throw new Error(`Phản hồi ${resourceName} không đúng định dạng.`);
};

export const fetchAllPages = async (requestPage, params = {}) => {
  const items = [];
  let page = 1;

  while (true) {
    const response = await requestPage({
      ...params,
      page,
      limit: ADMIN_API_PAGE_SIZE,
    });
    const pageItems = asCollection(response);
    items.push(...pageItems);

    const totalPages = Number(response?.pagination?.totalPages);
    if (!Number.isFinite(totalPages) || page >= totalPages) break;
    page += 1;
  }

  return items;
};
