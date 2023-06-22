import { type NextApiRequest, type NextApiResponse } from "next";
import { prisma } from "../../../server/db";

interface AddDistanceBody {
  distance: number;
}

const addDistanceHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  console.log(req.body);
  console.log(typeof req.body);

  // eslint-disable-next-line
  const data: AddDistanceBody = JSON.parse(req.body);

  if (data.distance === undefined || typeof data.distance !== "number") {
    return res.status(400).json({ error: "Invalid distance" });
  }

  const deskDistance = await prisma.deskDistance.create({
    data: { distance: data.distance },
  });

  res.status(200).json({ success: true, ...deskDistance });
};

export default addDistanceHandler;
