const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const User = require('./models/User');
const Plant = require('./models/Plant');
const Post = require('./models/Post');
const Reminder = require('./models/Reminder');
const Message = require('./models/Message');

dotenv.config({ path: path.join(__dirname, '.env') });

const seedData = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/greenthumb';
    await mongoose.connect(mongoURI);
    console.log('🌿 Connected to MongoDB for seeding...');

    // Clear existing collections if desired
    await User.deleteMany();
    await Plant.deleteMany();
    await Post.deleteMany();
    await Reminder.deleteMany();
    await Message.deleteMany();

    console.log('🧹 Cleaned existing database collections');

    // Create Demo Users
    const user1 = await User.create({
      name: 'Maya Green',
      email: 'maya@greenthumb.io',
      password: 'password123',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
      bio: 'Botanist & urban jungle enthusiast. Living with 45+ houseplants! 🪴',
    });

    const user2 = await User.create({
      name: 'Oliver Thorne',
      email: 'oliver@greenthumb.io',
      password: 'password123',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      bio: 'Succulent and cactus collector. Propagating new cuts weekly 🌵',
    });

    const demoUser = await User.create({
      name: 'Demo Gardener',
      email: 'demo@greenthumb.io',
      password: 'password123',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      bio: 'Excited new plant parent learning all about soil aeration and watering schedules.',
    });

    console.log('👤 Created demo users: demo@greenthumb.io / maya@greenthumb.io / oliver@greenthumb.io (password: password123)');

    // Create Plants for Demo User
    const plant1 = await Plant.create({
      userId: demoUser._id,
      name: 'Monty Monstera',
      species: 'Monstera Deliciosa',
      description: 'Splendid tropical plant with dramatic fenestrations. Thrives near east window.',
      location: 'Living Room East Corner',
      wateringFrequency: 7,
      lastWatered: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
      nextWatering: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // in 2 days
      imageUrl: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=600&auto=format&fit=crop&q=80',
      sunlightRequirement: 'Bright Indirect',
      healthStatus: 'Thriving',
    });

    const plant2 = await Plant.create({
      userId: demoUser._id,
      name: 'Spike the Aloe',
      species: 'Aloe Vera (Succulent)',
      description: 'Hardy medicinal succulent with healing gel. Needs very little water.',
      location: 'Kitchen Windowsill',
      wateringFrequency: 14,
      lastWatered: new Date(Date.now() - 13 * 24 * 60 * 60 * 1000), // 13 days ago
      nextWatering: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // tomorrow!
      imageUrl: 'https://images.unsplash.com/photo-1567689265664-1c48de61db0b?w=600&auto=format&fit=crop&q=80',
      sunlightRequirement: 'Direct Sunlight',
      healthStatus: 'Healthy',
    });

    const plant3 = await Plant.create({
      userId: demoUser._id,
      name: 'Cleo Calathea',
      species: 'Calathea Orbifolia',
      description: 'Loves high humidity and misting. Round striped leaves fold up at night.',
      location: 'Bedroom Nightstand',
      wateringFrequency: 5,
      lastWatered: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), // overdue!
      nextWatering: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // yesterday
      imageUrl: 'https://images.unsplash.com/photo-1598880940080-ff9a29891b85?w=600&auto=format&fit=crop&q=80',
      sunlightRequirement: 'Bright Indirect',
      healthStatus: 'Needs Water',
    });

    const plant4 = await Plant.create({
      userId: demoUser._id,
      name: 'Pearl String',
      species: 'Senecio rowleyanus (Succulent)',
      description: 'Trailing succulent with beads resembling peas. In terracotta hanging pot.',
      location: 'Sunroom Pergola',
      wateringFrequency: 10,
      lastWatered: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      nextWatering: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      imageUrl: 'https://images.unsplash.com/photo-1509423350716-97f9360b4e09?w=600&auto=format&fit=crop&q=80',
      sunlightRequirement: 'Bright Indirect',
      healthStatus: 'Thriving',
    });

    console.log('🌱 Created demo plants for user');

    // Create Reminders for Demo User
    await Reminder.create({
      userId: demoUser._id,
      plantId: plant3._id,
      title: 'Water Cleo Calathea (Urgent)',
      reminderDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      reminderType: 'Watering',
      completed: false,
      notes: 'Soil is completely dry. Use filtered water to avoid leaf browning.',
    });

    await Reminder.create({
      userId: demoUser._id,
      plantId: plant2._id,
      title: 'Water Spike the Aloe',
      reminderDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
      reminderType: 'Watering',
      completed: false,
      notes: 'Succulent watering: soak thoroughly and allow pot to drain.',
    });

    await Reminder.create({
      userId: demoUser._id,
      plantId: plant1._id,
      title: 'Fertilize Monty with Organic Feed',
      reminderDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
      reminderType: 'Fertilizing',
      completed: false,
      notes: 'Dilute balanced houseplant liquid fertilizer to half strength.',
    });

    await Reminder.create({
      userId: demoUser._id,
      plantId: plant1._id,
      title: 'Wipe down Monstera leaves',
      reminderDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      reminderType: 'General Care',
      completed: true,
      notes: 'Cleaned dust with damp microfiber cloth.',
    });

    console.log('⏰ Created care reminders');

    // Create Community Posts
    const post1 = await Post.create({
      userId: user1._id,
      title: 'Golden rule for watering succulents without root rot',
      content:
        'Always check the bottom drainage holes before watering! If the bottom soil still has moisture, wait another 3-4 days. Terracotta pots make a massive difference because they allow soil aeration and wick away excess moisture.',
      imageUrl: 'https://images.unsplash.com/photo-1520302630591-fd1c66edc19d?w=800&auto=format&fit=crop&q=80',
      tags: ['succulent', 'watering-guide', 'plant-tips'],
      likes: [user2._id, demoUser._id],
      comments: [
        {
          userId: user2._id,
          text: 'Totally agree! Switched all my Echeverias to unglazed terracotta and lost zero plants this winter.',
          createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
        },
        {
          userId: demoUser._id,
          text: 'This is super helpful for my aloe vera, thank you Maya!',
          createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
        },
      ],
    });

    const post2 = await Post.create({
      userId: user2._id,
      title: 'Look at this new leaf unfurling on my Monstera Deliciosa! 🌿',
      content:
        'After 3 weeks of waiting, this leaf has double fenestrations! Humidity tray + morning direct sun was the secret sauce. Do you mist your monsteras or use a humidifier?',
      imageUrl: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=800&auto=format&fit=crop&q=80',
      tags: ['monstera', 'propagation', 'indoor-garden'],
      likes: [user1._id],
      comments: [
        {
          userId: user1._id,
          text: 'Gorgeous fenestrations! A humidifier near the plant is definitely superior to surface misting.',
          createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000),
        },
      ],
    });

    // Create sample chat messages
    await Message.create({
      room: 'general',
      sender: user1._id,
      senderName: 'Maya Green',
      senderAvatar: user1.avatar,
      message: 'Welcome everyone to GreenThumb community chat! Ask any plant questions here 🌱',
    });

    await Message.create({
      room: 'general',
      sender: user2._id,
      senderName: 'Oliver Thorne',
      senderAvatar: user2.avatar,
      message: 'Hey all! Happy to help identify succulents or advise on soil mixes.',
    });

    console.log('💬 Created community posts and chat messages');
    console.log('✅ Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
};

seedData();
