import express from 'express'
import { MongoClient, ObjectId } from 'mongodb';
import 'dotenv/config'
import cors from "cors"
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


// create-events
app.post('/create-events', async(req,res)=>{
    const data =req.body

    const result = await eventCollection.insertOne(data)
    console.log(result)

    res.send(result)
})

// upcoming-events
app.get('/upcoming-events', async(req,res)=>{
  const apiResult = await eventCollection.find().toArray()
  // console.log(apiResult)
  res.send(apiResult)
})

// upcoming-events details
app.get('/upcoming-events/:id', async(req,res)=>{
  const {id} = req.params
  const result = await eventCollection.findOne({_id: new ObjectId(id)})
  res.send(result)
})

// manage-events
app.get('/manage-events/:email', async(req, res) => {
  const { email } = req.params;
  const result = await eventCollection.find({ email: email }).toArray();

  res.send(result);
});


// edit events
app.patch('/upcoming-events/:id', async(req,res)=>{
  const {id} = req.params
  const updateddata = req.body
  const result =  await eventCollection.updateOne(
    {_id: new ObjectId(id)},
    {$set: updateddata}
  )
  res.json(result)
})

// delete events 
app.delete('/upcoming-events/:id', async(req,res)=>{
  const {id} = req.params
  const result = await eventCollection.deleteOne({_id: new ObjectId(id)})
  res.json(result)
})

// joined events
app.post('/joined-events', async(req, res) =>{
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
app.get('/joined-event/:email', async(req,res)=>{
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