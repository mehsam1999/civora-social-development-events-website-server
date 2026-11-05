import express from 'express'
import { MongoClient, ObjectId } from 'mongodb';
import 'dotenv/config'
import cors from "cors"
import { createRemoteJWKSet, jwtVerify } from 'jose';
const app = express()
const PORT = 8000


app.use(cors())
app.use(express.json())


const client = new MongoClient(process.env.MONGODB_URL);

export async function connectToMongoDB() {
  try {
    await client.connect();
    console.log("You successfully connected to MongoDB!");
    return client;
  } catch (err) {
    console.dir(err);
  }
}

// database
const mongoClient = await connectToMongoDB()
const db = mongoClient.db("civora")
const eventCollection = db.collection("upcomingEvent")
const joinedEventCollection = db.collection("joinedEvent")

const verifyToken = async(req, res, next)=>{
  const authHeader = req.headers.authorization
  console.log(authHeader)

  if(!authHeader){
    return res.status(401).send({ msg: 'Unauthorized!'})
  }

  const token = authHeader.split(" ")[1]
  if(!token){
    return res.status(401).send({ msg: 'Unauthorized!'})
  }

  const JWKS = createRemoteJWKSet(new URL(`${process.env.CLIENT_URL}/api/auth/jwks`))
  try{
    const {payload} = await jwtVerify(token, JWKS)
    // console.log(payload)
    next()
  }
  catch{
    return res.status(500).send({ msg: 'Server Error!'})
  }

}


// create-events
app.post('/create-events', verifyToken, async(req,res)=>{
    const data =req.body

    const result = await eventCollection.insertOne(data)
    console.log(result)

    res.send(result)
})

// upcoming-events
app.get('/upcoming-events', async(req,res)=>{
  const today = new Date().toLocaleDateString("en-GB")
  const apiResult = await eventCollection.find({ eventDate: { $gte: today } }).sort({ eventDate: 1 }).toArray() //greater than equal today's date
  // console.log(apiResult)
  res.send(apiResult)
})

// upcoming-events details
app.get('/upcoming-events/:id', async(req,res)=>{
  const {id} = req.params
  const result = await eventCollection.findOne({_id: new ObjectId(id)})
  res.send(result)
})

// recent-upcoming Events
app.get('/recent-upcoming-events', async (req, res) =>{
  const today = new Date().toLocaleDateString("en-GB")
  const result = await eventCollection.find({ eventDate: { $gte: today } }).sort({ eventDate: 1 }).limit(6).toArray() //greater than equal today's date

  res.send(result)
})

// manage-events
app.get('/manage-events/:email', verifyToken, async(req, res) => {
  const { email } = req.params;
  const result = await eventCollection.find({ email: email }).toArray();

  res.send(result);
});
// edit events
app.patch('/upcoming-events/:id', verifyToken, async(req,res)=>{
  const {id} = req.params
  const updateddata = req.body
  const result =  await eventCollection.updateOne(
    {_id: new ObjectId(id)},
    {$set: updateddata}
  )
  res.json(result)
})
// delete events 
app.delete('/upcoming-events/:id', verifyToken, async(req,res)=>{
  const {id} = req.params
  const result = await eventCollection.deleteOne({_id: new ObjectId(id)})
  res.json(result)
})

// joined events
app.post('/joined-events', verifyToken, async(req, res) =>{
  const data = req.body

  const alreadyJoined = await joinedEventCollection.findOne({
    email: data.email,
    eventId: data.eventId
  });

  if (alreadyJoined) {
    return res.status(409).send({
      message: "You have already joined this event!"
    });
  }
  
  const result = await joinedEventCollection.insertOne(data)
  // console.log(result)
  res.send(result)
})
app.get('/joined-event/:email', verifyToken, async(req,res)=>{
  const {email} = req.params
  const result = await joinedEventCollection.find({email:email}).sort({eventDate: 1})
    .toArray()
  res.send(result)
})


app.get('/', (req,res)=>{
    res.send('server is running')
})

app.listen(PORT, ()=>{
    console.log(`Server is running at ${PORT}`)
})

export default app