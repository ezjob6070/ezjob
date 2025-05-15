
// Fix for line 79 - Convert Date to string format
createdAt: new Date().toISOString(), // or new Date().toISOString().split('T')[0] for YYYY-MM-DD format
