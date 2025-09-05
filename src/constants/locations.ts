import parkImg from "@/assets/Park.jpg";
import cafeImg from "@/assets/Café.jpg";
import restaurantImg from "@/assets/Restaurant.jpg";
import hotelImg from "@/assets/Hotel.png";
import museumImg from "@/assets/Museum.png";
import storeImg from "@/assets/Store.png";
import otherImg from "@/assets/Bar.png";

export const locationTypeImages: Record<string, string> = {
  PARK: parkImg,
  RESTAURANT: restaurantImg,
  HOTEL: hotelImg,
  MUSEUM: museumImg,
  STORE: storeImg,
  CAFÉ: cafeImg,
  OTHER: otherImg,
};

export function parseAddress(addressStreet: string): {
  city: string;
  street: string;
} {
  const [city, ...streetParts] = addressStreet.split(",");
  return {
    city: city.trim(),
    street: streetParts.join(",").trim(),
  };
}
