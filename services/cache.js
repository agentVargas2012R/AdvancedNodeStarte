const mongoose = require('mongoose');
const redis = require('redis');
const util = require('util');
const keys = require('../config/keys');

const exec = mongoose.Query.prototype.exec;

//handle based on environment.
const client = redis.createClient();

client.hget = util.promisify(client.hget);
client.pexpire = util.promisify(client.pexpire);
client.del = util.promisify(client.del);

mongoose.Query.prototype.cache = function(options = {}) {
    this.useCache = true;
    this.hashKey = JSON.stringify(options.key || '');
    return this;    
}

mongoose.Query.prototype.exec = async function () {

      if(!this.useCache) {
            return this.exec.apply(this, arguments);
       }

        console.log("I'm About To Run A QUERY");
        console.log(this.getQuery());
        console.log(this.mongooseCollection.name);

        const key = JSON.stringify(Object.assign({}, this.getQuery(), {
            collection: this.mongooseCollection.name
        }));

        //see if we have a value ofr 'key' in redis
        const cacheValue = await client.hget(this.hashKey, key);
        if(cacheValue) {                
            const doc = JSON.parse(cacheValue);
            return Array.isArray(doc)  
                ? doc.map(d => this.model(d))   
                : new this.model(doc) ;
        }

        const result = await exec.apply(this, arguments);

        console.log(result);

        //only applies to future records. 
        client.hset(this.hashKey, key, JSON.stringify(result));    
        client.pexpire(this.hashKey, 10);

        return JSON.stringify(result);
};

module.exports = {
    clearHash(hashKey) {
        client.del(JSON.stringify(hashKey));
    }
};