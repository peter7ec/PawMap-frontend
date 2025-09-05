import { API_URL } from "../constants/environment";

const searchService = {
  async getItems(page: number, orderParam: string, searchTerm: string) {
    const sortBy = orderParam.split("_")[0];
    const order = orderParam.split("_")[1];
    const response = await fetch(
      `${API_URL}/api/location?page=${page}&pageSize=6&sortBy=${sortBy}&order=${order}&searchTerm=${searchTerm}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.json();
  },
};
export default searchService;
