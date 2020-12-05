interface Cake {
  weight: number;
  value: number;
}

let memo = {};
function maxDuffelBagValue(
  cakes: Array<Cake>,
  capacity: number,
  cakeIndex = 0
) {
  if (!memo[capacity]) {
    memo[capacity] = {};
  }
  if (memo[capacity][cakeIndex]) {
    return memo[capacity][cakeIndex];
  }

  if (cakeIndex >= cakes.length) {
    return 0;
  }

  if (capacity < 0) {
    return -Infinity;
  }

  const max = Math.max(
    maxDuffelBagValue(
      cakes,
      capacity - cakes[cakeIndex].weight,
      cakeIndex + 1
    ) + cakes[cakeIndex].value,
    maxDuffelBagValue(cakes, capacity, cakeIndex + 1)
  );

  memo[capacity][cakeIndex] = max;
  return max;
}

console.log(
  maxDuffelBagValue(
    [
      { weight: 7, value: 140 },
      { weight: 3, value: 90 },
      { weight: 2, value: 15 },
      { weight: 0, value: 15 }
    ],
    5
  )
);
