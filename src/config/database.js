export default {
    mongoUrl: process.env.NODE_ENV === 'test' ? process.env.MONGODB_TEST_URL : process.env.MONGODB_URL,
    mongoUser: process.env.MONGODB_USER,
    mongoPassword: process.env.MONGODB_PASSWORD
}
