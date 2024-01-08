// import * as tf from "@tensorflow/tfjs";

const checkNearbyPoints = async (base, corePoints, borderPoints, indices,   nearStats) => {
    // Find nearby points
  // Find nearby points

  
  const baseRow = tf.gather(nearStats, base, 0);
  console.log('base row: ', baseRow)
  baseRow.print('Tensor Values:', baseRow);

  if (baseRow == null) {
    console.error("baseRow is null or undefined");
    return [corePoints, borderPoints, indices];
  }
  const nearby = tf.where(baseRow);

  if (nearby.shape[0] === 0) {
    // No nearby points, return without further processing
    return [corePoints, borderPoints, indices];
  }

  
  const newCore = tf.setdiff1d(tf.intersect1d(nearby, corePoints).flatten(), 0);
  const newBorder = tf.setdiff1d(tf.intersect1d(nearby, borderPoints).flatten(), 0);
  
    // Stop tracking discovered points. Add those to cluster
    corePoints = tf.setdiff1d(corePoints, newCore).flatten().arraySync();
    borderPoints = tf.setdiff1d(borderPoints, newBorder).flatten().arraySync();
    indices = tf.unique(tf.concat([indices, newCore, newBorder])).y.arraySync();
  
    // when new core points discovered, recurse
    process.stdout.write('.');
    if (newCore.length > 0) {
      for (let i = 0; i < newCore.length; i++) {
        const result = await checkNearbyPoints(newCore[i], corePoints, borderPoints, indices, nearStats);
        corePoints = result[0];
        borderPoints = result[1];
        indices = result[2];
      }
    }
  
    return [corePoints, borderPoints, indices];
  };
  
  // Example usage:
  const runAsyncCode = async () => {
    const baseIndex = 0;
    const initialCorePoints = tf.tensor1d([1, 2, 3, 4]);
    const initialBorderPoints = tf.tensor1d([5, 6, 7, 8]);
    const initialIndices = tf.tensor1d([9, 10, 11]);
    const initialNearStats = tf.tensor2d([[false, true, true, false],
                                           [true, false, false, true], 
                                           [true, false, false, false], 
                                           [false, true, false, false]]);
  
    const result = await checkNearbyPoints(
      baseIndex,
      initialCorePoints,
      initialBorderPoints,
      initialIndices,
      initialNearStats
    );
  
    console.log('\nResult:', result);
  };
  
  runAsyncCode();
  
  // console.log('\nResult:', result);
  