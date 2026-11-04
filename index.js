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

const mongoClient = await connectToMongoDB()
const db = mongoClient.db("civora")
const eventCollection = db.collection("upcomingEvent")

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


app.get('/', (req,res)=>{
    res.send('server is running')
})

app.listen(PORT, ()=>{
    console.log(`Server is running at ${PORT}`)
})