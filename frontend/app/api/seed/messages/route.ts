import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/db/mongodb';
import { ObjectId } from 'mongodb';

// Add more messages to existing conversations
export async function GET(request: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db("fitness-buddy");
    
    // Get all conversations
    const conversations = await db.collection("conversations").find({}).toArray();
    
    if (conversations.length === 0) {
      return NextResponse.json({ 
        success: false, 
        error: "No conversations found" 
      }, { status: 404 });
    }

    // Get all users
    const users = await db.collection("users").find({}).toArray();
    
    if (users.length < 2) {
      return NextResponse.json({ 
        success: false, 
        error: "Not enough users to create messages" 
      }, { status: 400 });
    }

    // Create new messages for each conversation
    const allNewMessages = [];
    
    for (const conversation of conversations) {
      // Get participants for this conversation
      const participants = conversation.participants || [];
      
      if (participants.length < 2 && !conversation.isGroupChat) {
        continue; // Skip conversations with insufficient participants
      }
      
      // For group chats, use all participants
      // For one-on-one chats, use the two participants
      const messageParticipants = conversation.isGroupChat 
        ? participants 
        : participants.slice(0, 2);
      
      // Create 5-10 new messages for this conversation
      const messageCount = Math.floor(Math.random() * 6) + 5;
      const conversationMessages = [];
      
      // Create messages with timestamps from the past hour to now
      for (let i = 0; i < messageCount; i++) {
        const sender = messageParticipants[Math.floor(Math.random() * messageParticipants.length)];
        const minutesAgo = Math.floor(Math.random() * 60);
        const timestamp = new Date(Date.now() - (minutesAgo * 60 * 1000));
        
        // Generate message content based on conversation context
        let content = '';
        if (conversation.isGroupChat) {
          const topics = [
            "Has anyone tried the new protein shake recipe?",
            "Just finished a 5K run! New personal best!",
            "Who's joining the weekend challenge?",
            "Check out this article on muscle recovery techniques.",
            "What's your favorite post-workout meal?",
            "Anyone want to join me for a virtual workout tomorrow?",
            "I'm struggling with my squat form. Any tips?",
            "Just hit a new deadlift PR! 💪",
            "How do you stay motivated on rest days?",
            "Thinking about trying yoga for recovery. Thoughts?",
            "What's your go-to pre-workout snack?",
            "Anyone using fitness trackers? Which one do you recommend?",
            "Just signed up for a marathon in June. Training starts now!",
            "Need advice on reducing muscle soreness after leg day.",
            "What's your favorite workout playlist?"
          ];
          content = topics[Math.floor(Math.random() * topics.length)];
        } else {
          const oneOnOneTopics = [
            "How's your training going?",
            "Did you try that workout I suggested?",
            "I'm thinking of changing my routine. Any advice?",
            "Just logged my meals for the day. Hitting my protein goals!",
            "Want to do a virtual workout together sometime?",
            "Have you used the mindfulness features yet?",
            "My progress chart is looking good this month!",
            "What supplements are you taking?",
            "Just completed today's challenge. It was tough!",
            "How many rest days do you take per week?",
            "I'm planning my meals for next week. Any recipes to share?",
            "Do you track your sleep quality?",
            "Just added you to my workout challenge group!",
            "Have you tried the new HIIT workout in the app?",
            "What's your fitness goal for this month?"
          ];
          content = oneOnOneTopics[Math.floor(Math.random() * oneOnOneTopics.length)];
        }
        
        const message = {
          _id: new ObjectId(),
          conversationId: conversation._id,
          content,
          sender: {
            _id: sender._id,
            name: sender.name,
            avatar: sender.avatar
          },
          read: Math.random() > 0.3, // 70% chance of being read
          createdAt: timestamp
        };
        
        conversationMessages.push(message);
        allNewMessages.push(message);
      }
      
      // Sort messages by timestamp
      conversationMessages.sort((a, b) => {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      });
      
      // Update the conversation's last message
      const lastMessage = conversationMessages[conversationMessages.length - 1];
      await db.collection("conversations").updateOne(
        { _id: conversation._id },
        { 
          $set: { 
            lastMessage: {
              content: lastMessage.content,
              timestamp: lastMessage.createdAt,
              sender: lastMessage.sender._id
            },
            updatedAt: new Date()
          } 
        }
      );
    }
    
    // Insert all new messages
    if (allNewMessages.length > 0) {
      await db.collection("messages").insertMany(allNewMessages);
    }

    return NextResponse.json({ 
      success: true, 
      message: "Additional messages created successfully", 
      data: {
        messageCount: allNewMessages.length,
        conversationCount: conversations.length
      }
    });
  } catch (error) {
    console.error("Error creating additional messages:", error);
    return NextResponse.json({ 
      success: false, 
      error: "Failed to create additional messages" 
    }, { status: 500 });
  }
}
