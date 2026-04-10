import Location from '../infrastructure/entities/Location.js';

export const getAllLocations = async (req, res) => {
  try {
    const locations = await Location.find();
    res.status(200).json(locations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createLocation = async (req, res) => {
  try {
    const locationData = req.body;

    if (!locationData.name) {
      res.status(400).json({ error: "Location name is required" });
      return;
    }

    const location = await Location.create(locationData);
    res.status(201).json(location);
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ error: "Location already exists" });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
};

export const getLocationById = async (req, res) => {
  try {
    const _id = req.params._id;
    const location = await Location.findById(_id);

    if (!location) {
      res.status(404).json({ error: "Location not found" });
      return;
    }

    res.status(200).json(location);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateLocation = async (req, res) => {
  try {
    const _id = req.params._id;
    const locationData = req.body;

    if (!locationData.name) {
      res.status(400).json({ error: "Location name is required" });
      return;
    }

    const location = await Location.findByIdAndUpdate(_id, locationData, {
      new: true,
      runValidators: true,
    });

    if (!location) {
      res.status(404).json({ error: "Location not found" });
      return;
    }

    res.status(200).json(location);
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ error: "Location already exists" });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
};

export const deleteLocation = async (req, res) => {
  try {
    const _id = req.params._id;
    const location = await Location.findByIdAndDelete(_id);

    if (!location) {
      res.status(404).json({ error: "Location not found" });
      return;
    }

    res.status(200).json({ message: "Location deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
