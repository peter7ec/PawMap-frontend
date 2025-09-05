import { API_URL } from "../constants/environment";

const eventSearchService = {
  async getItems(page: number, orderParams: string, searchTerm: string) {
    const sortBy = orderParams.split("_")[0];
    const order = orderParams.split("_")[1];
    const response = await fetch(
      `${API_URL}/api/event?page=${page}&pageSize=5&sortBy=${sortBy}&order=${order}&searchTerm=${searchTerm}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    );
    return response.json();
  },
};
export default eventSearchService;
