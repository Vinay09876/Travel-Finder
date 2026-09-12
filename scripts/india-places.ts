export interface SeedPlace {
  name: string;
  state: string;
  lat: number;
  lng: number;
}

// Curated list of well-known travel destinations across every Indian state/UT.
// Coordinates are town/landmark-level, used to query OpenStreetMap POIs within 10km.
// Destinations already present in lib/destinations.ts (goa, udaipur, jaipur, manali,
// gokarna, rishikesh, pondicherry) are intentionally omitted to avoid wasted API calls —
// the generation pipeline would skip them anyway via the DB cache check.
export const INDIA_PLACES: SeedPlace[] = [
  // Andhra Pradesh
  { name: 'Araku Valley', state: 'Andhra Pradesh', lat: 18.3273, lng: 82.8770 },
  { name: 'Tirupati', state: 'Andhra Pradesh', lat: 13.6288, lng: 79.4192 },
  { name: 'Visakhapatnam', state: 'Andhra Pradesh', lat: 17.6868, lng: 83.2185 },

  // Arunachal Pradesh
  { name: 'Tawang', state: 'Arunachal Pradesh', lat: 27.5860, lng: 91.8594 },
  { name: 'Ziro Valley', state: 'Arunachal Pradesh', lat: 27.5480, lng: 93.8320 },

  // Assam
  { name: 'Kaziranga', state: 'Assam', lat: 26.5775, lng: 93.1714 },
  { name: 'Majuli', state: 'Assam', lat: 26.9526, lng: 94.1697 },
  { name: 'Guwahati', state: 'Assam', lat: 26.1445, lng: 91.7362 },

  // Bihar
  { name: 'Bodh Gaya', state: 'Bihar', lat: 24.6959, lng: 84.9917 },
  { name: 'Nalanda', state: 'Bihar', lat: 25.1358, lng: 85.4436 },
  { name: 'Rajgir', state: 'Bihar', lat: 25.0295, lng: 85.4200 },

  // Chhattisgarh
  { name: 'Chitrakote Falls', state: 'Chhattisgarh', lat: 19.1911, lng: 81.6767 },
  { name: 'Bastar', state: 'Chhattisgarh', lat: 19.3100, lng: 81.9600 },

  // Goa (extra towns beyond the curated "goa" entry)
  { name: 'Palolem', state: 'Goa', lat: 15.0100, lng: 74.0233 },

  // Gujarat
  { name: 'Rann of Kutch', state: 'Gujarat', lat: 23.7337, lng: 69.8597 },
  { name: 'Gir National Park', state: 'Gujarat', lat: 21.1290, lng: 70.7930 },
  { name: 'Somnath', state: 'Gujarat', lat: 20.8880, lng: 70.4013 },
  { name: 'Dwarka', state: 'Gujarat', lat: 22.2394, lng: 68.9678 },

  // Haryana
  { name: 'Kurukshetra', state: 'Haryana', lat: 29.9695, lng: 76.8783 },
  { name: 'Panchkula', state: 'Haryana', lat: 30.6942, lng: 76.8606 },

  // Himachal Pradesh
  { name: 'Shimla', state: 'Himachal Pradesh', lat: 31.1048, lng: 77.1734 },
  { name: 'Spiti Valley', state: 'Himachal Pradesh', lat: 32.2461, lng: 78.0349 },
  { name: 'Dharamshala', state: 'Himachal Pradesh', lat: 32.2190, lng: 76.3234 },
  { name: 'Kasol', state: 'Himachal Pradesh', lat: 32.0100, lng: 77.3145 },
  { name: 'Dalhousie', state: 'Himachal Pradesh', lat: 32.5387, lng: 75.9700 },

  // Jharkhand
  { name: 'Netarhat', state: 'Jharkhand', lat: 23.4700, lng: 84.2667 },
  { name: 'Betla National Park', state: 'Jharkhand', lat: 23.8800, lng: 84.1900 },

  // Karnataka
  { name: 'Coorg', state: 'Karnataka', lat: 12.3375, lng: 75.8069 },
  { name: 'Hampi', state: 'Karnataka', lat: 15.3350, lng: 76.4600 },
  { name: 'Chikmagalur', state: 'Karnataka', lat: 13.3161, lng: 75.7720 },
  { name: 'Mysuru', state: 'Karnataka', lat: 12.2958, lng: 76.6394 },

  // Kerala
  { name: 'Munnar', state: 'Kerala', lat: 10.0889, lng: 77.0595 },
  { name: 'Alleppey', state: 'Kerala', lat: 9.4981, lng: 76.3388 },
  { name: 'Wayanad', state: 'Kerala', lat: 11.6854, lng: 76.1320 },
  { name: 'Kochi', state: 'Kerala', lat: 9.9312, lng: 76.2673 },
  { name: 'Varkala', state: 'Kerala', lat: 8.7379, lng: 76.7163 },

  // Madhya Pradesh
  { name: 'Khajuraho', state: 'Madhya Pradesh', lat: 24.8318, lng: 79.9199 },
  { name: 'Pachmarhi', state: 'Madhya Pradesh', lat: 22.4676, lng: 78.4336 },
  { name: 'Bandhavgarh National Park', state: 'Madhya Pradesh', lat: 23.6900, lng: 80.9700 },
  { name: 'Orchha', state: 'Madhya Pradesh', lat: 25.3520, lng: 78.6410 },

  // Maharashtra
  { name: 'Mahabaleshwar', state: 'Maharashtra', lat: 17.9307, lng: 73.6477 },
  { name: 'Lonavala', state: 'Maharashtra', lat: 18.7546, lng: 73.4062 },
  { name: 'Ajanta and Ellora Caves', state: 'Maharashtra', lat: 20.5518, lng: 75.7033 },
  { name: 'Alibaug', state: 'Maharashtra', lat: 18.6414, lng: 72.8722 },

  // Manipur
  { name: 'Loktak Lake', state: 'Manipur', lat: 24.5500, lng: 93.8000 },
  { name: 'Imphal', state: 'Manipur', lat: 24.8170, lng: 93.9368 },

  // Meghalaya
  { name: 'Cherrapunji', state: 'Meghalaya', lat: 25.2702, lng: 91.7323 },
  { name: 'Shillong', state: 'Meghalaya', lat: 25.5788, lng: 91.8933 },
  { name: 'Dawki', state: 'Meghalaya', lat: 25.1820, lng: 92.0227 },

  // Mizoram
  { name: 'Aizawl', state: 'Mizoram', lat: 23.7271, lng: 92.7176 },

  // Nagaland
  { name: 'Kohima', state: 'Nagaland', lat: 25.6751, lng: 94.1086 },
  { name: 'Dzukou Valley', state: 'Nagaland', lat: 25.5500, lng: 94.1500 },

  // Odisha
  { name: 'Puri', state: 'Odisha', lat: 19.8135, lng: 85.8312 },
  { name: 'Konark', state: 'Odisha', lat: 19.8876, lng: 86.0945 },
  { name: 'Chilika Lake', state: 'Odisha', lat: 19.7000, lng: 85.3200 },

  // Punjab
  { name: 'Amritsar', state: 'Punjab', lat: 31.6340, lng: 74.8723 },

  // Rajasthan (beyond curated Udaipur/Jaipur)
  { name: 'Jaisalmer', state: 'Rajasthan', lat: 26.9157, lng: 70.9083 },
  { name: 'Jodhpur', state: 'Rajasthan', lat: 26.2389, lng: 73.0243 },
  { name: 'Pushkar', state: 'Rajasthan', lat: 26.4899, lng: 74.5511 },
  { name: 'Mount Abu', state: 'Rajasthan', lat: 24.5926, lng: 72.7156 },
  { name: 'Bikaner', state: 'Rajasthan', lat: 28.0229, lng: 73.3119 },

  // Sikkim
  { name: 'Gangtok', state: 'Sikkim', lat: 27.3389, lng: 88.6065 },
  { name: 'Pelling', state: 'Sikkim', lat: 27.2986, lng: 88.2325 },
  { name: 'Lachung', state: 'Sikkim', lat: 27.6891, lng: 88.7420 },

  // Tamil Nadu
  { name: 'Ooty', state: 'Tamil Nadu', lat: 11.4064, lng: 76.6932 },
  { name: 'Kodaikanal', state: 'Tamil Nadu', lat: 10.2381, lng: 77.4892 },
  { name: 'Rameswaram', state: 'Tamil Nadu', lat: 9.2876, lng: 79.3129 },
  { name: 'Mahabalipuram', state: 'Tamil Nadu', lat: 12.6269, lng: 80.1927 },
  { name: 'Madurai', state: 'Tamil Nadu', lat: 9.9252, lng: 78.1198 },

  // Telangana
  { name: 'Hyderabad', state: 'Telangana', lat: 17.3850, lng: 78.4867 },
  { name: 'Warangal', state: 'Telangana', lat: 17.9689, lng: 79.5941 },

  // Tripura
  { name: 'Agartala', state: 'Tripura', lat: 23.8315, lng: 91.2868 },

  // Uttar Pradesh
  { name: 'Agra', state: 'Uttar Pradesh', lat: 27.1767, lng: 78.0081 },
  { name: 'Varanasi', state: 'Uttar Pradesh', lat: 25.3176, lng: 82.9739 },
  { name: 'Lucknow', state: 'Uttar Pradesh', lat: 26.8467, lng: 80.9462 },
  { name: 'Ayodhya', state: 'Uttar Pradesh', lat: 26.7922, lng: 82.1998 },

  // Uttarakhand (beyond curated Rishikesh)
  { name: 'Nainital', state: 'Uttarakhand', lat: 29.3919, lng: 79.4542 },
  { name: 'Mussoorie', state: 'Uttarakhand', lat: 30.4598, lng: 78.0664 },
  { name: 'Auli', state: 'Uttarakhand', lat: 30.5292, lng: 79.5670 },
  { name: 'Jim Corbett National Park', state: 'Uttarakhand', lat: 29.5300, lng: 78.7747 },

  // West Bengal
  { name: 'Darjeeling', state: 'West Bengal', lat: 27.0410, lng: 88.2663 },
  { name: 'Sundarbans', state: 'West Bengal', lat: 21.9497, lng: 88.9468 },
  { name: 'Kolkata', state: 'West Bengal', lat: 22.5726, lng: 88.3639 },
  { name: 'Kalimpong', state: 'West Bengal', lat: 27.0669, lng: 88.4715 },

  // Union Territories
  { name: 'Port Blair', state: 'Andaman and Nicobar Islands', lat: 11.6234, lng: 92.7265 },
  { name: 'Havelock Island', state: 'Andaman and Nicobar Islands', lat: 12.0090, lng: 92.9600 },
  { name: 'Leh', state: 'Ladakh', lat: 34.1526, lng: 77.5771 },
  { name: 'Nubra Valley', state: 'Ladakh', lat: 34.6800, lng: 77.5600 },
  { name: 'Pangong Lake', state: 'Ladakh', lat: 33.7627, lng: 78.6600 },
  { name: 'Srinagar', state: 'Jammu and Kashmir', lat: 34.0837, lng: 74.7973 },
  { name: 'Gulmarg', state: 'Jammu and Kashmir', lat: 34.0484, lng: 74.3805 },
  { name: 'Pahalgam', state: 'Jammu and Kashmir', lat: 34.0161, lng: 75.3212 },
  { name: 'Chandigarh', state: 'Chandigarh', lat: 30.7333, lng: 76.7794 },
];
