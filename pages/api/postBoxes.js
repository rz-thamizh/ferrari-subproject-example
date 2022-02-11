import { MappanAPI } from '@/roanuz/lib/api';

const MappanApiKey = 'nsW0LYGBnTiOdqglOhT3bDiDeX3jWh8+iiGRcaKmxOk=';

export default async (req, res) => {
  const { code } = req.query;

  const response = await MappanAPI.instance(MappanApiKey).get(`/postboxes?postcode=${code}`);

  const jsonData = await response;

  if (jsonData) {
    res.status(200).json(jsonData.data);
  } else {
    res.status(404).json('Request failed');
  }
};
