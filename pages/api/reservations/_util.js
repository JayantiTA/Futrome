import connectToDatabase from '../../../lib/mongoose';
import Grave from '../../../models/grave';

const getGravesByIds = async (graves) => {
  await connectToDatabase();
  const gravesMap = new Map(
    graves.map((grave) => [grave.id.toString(), grave]),
  );
  const gravesByIds = await Grave.find({ _id: { $in: [...gravesMap.keys()] } });
  gravesByIds.forEach((grave) => {
    const newGrave = gravesMap.get(grave._id.toString());
    newGrave.location = grave.location;
    newGrave.price = grave.price;
    gravesMap.set(grave._id.toString(), newGrave);
  });
  return [...gravesMap.values()];
};

export { getGravesByIds };
