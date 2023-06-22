import { type NextApiRequest, type NextApiResponse } from "next";
import { prisma } from "../../../server/db";
import Cors from "cors";

interface AddDistanceBody {
  distance: number;
}

// Initializing the cors middleware
// You can read more about the available options here: https://github.com/expressjs/cors#configuration-options
// eslint-disable-next-line
const cors = Cors({ methods: ["POST"] });

// Helper method to wait for a middleware to execute before continuing
// And to throw an error when an error happens in a middleware
function runMiddleware(req: NextApiRequest, res: NextApiResponse) {
  return new Promise((resolve, reject) => {
    cors(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }

      return resolve(result);
    });
  });
}

const addDistanceHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  await runMiddleware(req, res);

  if (req.method !== "POST") {
    return res.status(405).end();
  }

  // eslint-disable-next-line
  const data: AddDistanceBody = JSON.parse(req.body);

  if (data.distance === undefined || typeof data.distance !== "number") {
    return res.status(400).json({ error: "Invalid distance" });
  }

  const deskDistance = await prisma.deskDistance.create({
    data: { distance: data.distance },
  });

  res
    .status(200)
    .setHeader("Access-Control-Allow-Origin", "*")
    .setHeader("Access-Control-Allow-Methods", "POST")
    .json({ success: true, ...deskDistance });
};

export default addDistanceHandler;
