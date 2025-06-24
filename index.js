const express = require("express");
const {initializeDatabase} = require("./db/db.connect");
const MeetupEvent = require("./models/meetup.model")
const cors = require("cors")
const fs = require("fs");
const app = express()

const corsOptions = {
    origin:"*",
    credentials:true,
    optionSuccessStatus:200,
}

initializeDatabase()
app.use(express.json())
app.use(cors(corsOptions))

const jsonData = fs.readFileSync('events.json','utf-8');
const eventsData = JSON.parse(jsonData);

async function seedData() {
    try{
        await MeetupEvent.deleteMany({});
        // console.log("Cleared existing events\n");

        for(const eventData of eventsData){
            const newEvent = new MeetupEvent({
                 title: eventData.title,
                 date:eventData.date ,
                 timeToStart: eventData.timeToStart,
                 timeToEnd: eventData.timeToEnd,
                 eventType: eventData.eventType,
                 thumbnail: eventData.thumbnail,
                 host: eventData.host,
                 details: eventData.details,
                 eventTags: eventData.eventTags,
                 dressCode: eventData.dressCode,
                 ageRestrictions:eventData.ageRestrictions,
                 locationCity: eventData.locationCity,
                 locationAddress:eventData.locationAddress,
                 price: eventData.price,
                 speakers: eventData.speakers
              });

              await newEvent.save()
            //   console.log(eventData.title)
        }
    }catch(error){
        console.log(error);
    }
}

seedData()

async function readAllEvents() {
    try{
        const allEvents = await MeetupEvent.find()
        return allEvents;
    }catch(error){
        console.log("Error occurred while fetching the data",error);
    }
}

app.get("/events",async (req,res)=>{
    try{
        const events = await readAllEvents();
        
        if(events){
            res.status(200).json(events)
        }else{
            res.status(404).json({error:"Event deos not found!"})
        }
    }catch(error){
        console.log("Failed to get data",error)
    }
})

const PORT = 3000;
app.listen(PORT,()=>{
    console.log("Server is running on port",PORT)
})