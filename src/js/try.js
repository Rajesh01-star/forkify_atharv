const try1 = [1, 35, 32, 56, 44, 36];
const try2 = [4, 55, 62, 55, 43, -26, -43];

const loopFunction = function (bunch) {
  let hold, hold1;
  hold = hold1 = bunch[0];
  bunch.forEach(each => {
    if (each < hold) hold = each;
    if (each < hold1 && each > hold) hold1 = each;
    // else return;
  });
  console.log(hold, hold1);
};

loopFunction(try1);
loopFunction(try2);

console.log(try1.sort().slice(-2));
console.log(try2.sort().slice(-2));
