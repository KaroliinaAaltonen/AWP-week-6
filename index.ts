// Disclaimer: I copied the example project used on the lecture and edited it to avoid the wrath of codegrade

import express, {Express, Request, Response} from "express"
import bodyParser from 'body-parser';

const app: Express = express()
const port: number = 3000

// sending "Hello world!"
app.get("/hello", (req: Request, res: Response) => {
    res.send("Hello world!")
})

// vehicle interface
interface BaseVehicle {
  model: string;
  color: string;
  year: number;
  power: number;
}

// Task 3
// each different vehicle needs an interface
interface Car extends BaseVehicle {
    bodyType: string;
    wheelCount: number;
  }
  
  interface Boat extends BaseVehicle {
    draft: number;
  }
  
  interface Plane extends BaseVehicle {
    wingspan: number;
  }

// Union type for any vehicle type
type AnyVehicle = Car | Boat | Plane;

// bodyParser middleware to parse JSON
app.use(bodyParser.json());

// list for storing vehicles
const vehiclesList: AnyVehicle[] = [];

// POST route for adding vehicles
app.post('/vehicle/add', (req: Request, res: Response) => {
    // properties from the request body
    const { model, color, year, power, bodyType, wheelCount, draft, wingspan } = req.body as any;
  
    // Checking for missing properties because I can't get this to work in POSTMAN
    // future note: the issue was that POSTMAN didn't have "Content-Type: application/json" header.
    // also raw JSON object was missing :)
    const missingProperties: string[] = [];
    if (!model) missingProperties.push('model');
    if (!color) missingProperties.push('color');
    if (!year) missingProperties.push('year');
    if (!power) missingProperties.push('power');
  
    if (missingProperties.length > 0) {
      return res.status(400).json({ error: 'Missing required properties', missingProperties });
    }

    // Check vehicle type and properties (just fancy)
    // if there are wheels but the type is undefined, it's probably a car and so on
    // uses Type guard functions
    if (isCar(req.body)) {
        console.log("This is a car now");
        const newCar: Car = { model, color, year, power, bodyType, wheelCount };
        vehiclesList.push(newCar);
      } 
      else if (isBoat(req.body)) {
        console.log("This is a boat now");
        const newBoat: Boat = { model, color, year, power, draft };
        vehiclesList.push(newBoat);
      } 
      else if (isPlane(req.body)) {
        console.log("This is a plane now");
        const newPlane: Plane = { model, color, year, power, wingspan };
        vehiclesList.push(newPlane);
      }

  // success message
  res.status(201).json({ message: 'Vehicle added' });
});

// for fun making assumptions what vehicle it is if the type is not defined
// TypeScript is strict about the types of properties so they
// can't be conditionally defined in if-else conditions (like I originally tried)

// Type guard function to check if it's a car/boat/plane
function isCar(vehicle: AnyVehicle): vehicle is Car {
    return 'bodyType' in vehicle && 'wheelCount' in vehicle;
  }
  
  function isBoat(vehicle: AnyVehicle): vehicle is Boat {
    return 'draft' in vehicle;
  }
  
  function isPlane(vehicle: AnyVehicle): vehicle is Plane {
    return 'wingspan' in vehicle;
  }
// Task 4
// GET route for searching vehicles by model
// Note to self: if the assignment tells to use "/vehicle/search/:model" it means "/vehicle/search/Opel" NOT "/vehicle/search/:Opel". Goodbye 1 hour of my life
app.get('/vehicle/search/:model', (req: Request, res: Response) => {
    // Get model from the request parameters
    const { model } = req.params;
  
    // Search vehiclesList for the given model
    const foundVehicle = vehiclesList.find((vehicle) => vehicle.model === model);
  
    // respond data when the vehicle is found
    if (foundVehicle) {
      // creating a copy-vehicle
      const responseVehicle: BaseVehicle = {
        model: foundVehicle.model,
        color: foundVehicle.color,
        year: foundVehicle.year,
        power: foundVehicle.power,
      };
      return res.json(responseVehicle);
    }
  
    // vehicle not found --> 404
    return res.status(404).json({ error: 'Vehicle not found' });
  });
//starting server on port 3000
app.listen(port, () => {
    console.log("Server is UP AND RUNNING at http://localhost:" + port)
})