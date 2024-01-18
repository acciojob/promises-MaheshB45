//your JS code here. If required.
class MyPromise {
  constructor(executor) {
    this.state = 'pending';
    this.value = null;
    this.callbacks = [];

    const resolve = (value) => {
      if (this.state === 'pending') {
        this.state = 'fulfilled';
        this.value = value;
        this.executeCallbacks();
      }
    };

    const reject = (reason) => {
      if (this.state === 'pending') {
        this.state = 'rejected';
        this.value = reason;
        this.executeCallbacks();
      }
    };

    try {
      executor(resolve, reject);
    } catch (error) {
      reject(error);
    }
  }

  then(onFulfilled, onRejected) {
    return new MyPromise((resolve, reject) => {
      const callback = {
        onFulfilled: typeof onFulfilled === 'function' ? onFulfilled : null,
        onRejected: typeof onRejected === 'function' ? onRejected : null,
        resolve,
        reject,
      };

      this.callbacks.push(callback);

      if (this.state !== 'pending') {
        this.executeCallbacks();
      }
    });
  }

  catch(onRejected) {
    return this.then(null, onRejected);
  }

  executeCallbacks() {
    setTimeout(() => {
      while (this.callbacks.length) {
        const callback = this.callbacks.shift();
        this.handleCallback(callback);
      }
    }, 0);
  }

  handleCallback(callback) {
    const { onFulfilled, onRejected, resolve, reject } = callback;

    try {
      if (this.state === 'fulfilled') {
        const result = onFulfilled ? onFulfilled(this.value) : this.value;
        this.resolveOrReject(resolve, reject, result);
      } else if (this.state === 'rejected') {
        const result = onRejected ? onRejected(this.value) : this.value;
        this.resolveOrReject(resolve, reject, result);
      }
    } catch (error) {
      reject(error);
    }
  }

  resolveOrReject(resolve, reject, result) {
    if (result instanceof MyPromise) {
      result.then(resolve, reject);
    } else {
      resolve(result);
    }
  }
}

// Sample Usage #1
const promise = new MyPromise((res, rej) => {
  res(10);
});

promise
  .then((val) => {
    console.log(val);
    return val + 10;
  })
  .then((val) => {
    console.log(val);
    throw val + 10;
  })
  .then(
    (val) => {
      console.log(val);
      return val + 10;
    },
    (val) => {
      console.log('error: ' + val);
      return val + 20;
    }
  )
  .then((val) => {
    console.log(val);
    throw val + 10;
  })
  .catch((val) => {
    console.log('error: ' + val);
    return val + 10;
  })
  .then((val) => {
    console.log(val);
  });

console.log('end'); // this line runs before the then/catch chain.
