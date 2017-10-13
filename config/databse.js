const crypto=require("crypto").randomBytes(256).toString('hex')
module.exports={
    //uri:'mongodb://localhost:27017/meanstack-2',
    uri:'mongodb://ebasicstest:ebasicstest@ebasics-test-shard-00-00-dnrmf.mongodb.net:27017,ebasics-test-shard-00-01-dnrmf.mongodb.net:27017,ebasics-test-shard-00-02-dnrmf.mongodb.net:27017/meanstack-2?ssl=true&replicaSet=eBasics-test-shard-0&authSource=admin',
    secret:crypto,
    db: 'meanstack-2'
}