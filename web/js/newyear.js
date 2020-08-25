var b = document.body;
var c = document.getElementsByTagName('canvas')[0];
var a = c.getContext('2d');
document.body.clientWidth; // fix bug in chrome.

n = [];
M = Math;
Q = M.random;

c.height = c.width = W = t = 446;
J = [];
U = 16;
T = M.sin;

function F() {
    a.clearRect(0, 0, W, W);
    for (A = T(t - 11), i = 0; i < O; L.b = L.z * A - L.x * T(t)) (L = J[i++]).a = L.x * A + L.z * T(t);
    J.sort(function (a, b) {
        return a.b - b.b
    });
    for (a.font = '40px Comic Sans MS', a.fillStyle = '#e61b05', i = 0; i < O; a.drawImage(n[(L = J[i++]).n], 207 + L.a >> 0, 150 + L.y >> 0)) if (i == O >> 1) {
        a.fillText('С новым годом!', 65, 396)
    }
    ;
    t += .02;
    setTimeout(F, 9)
}

for (O = k = 0; k < 12; k++) with (n[k] = c.cloneNode(0)) {
    width = height = 32;
    with (getContext('2d')) {
        if (k > 9) {
            for (i = 0; i < 99; i += U) {
                beginPath();
                fillStyle = V + (147 + i) + ',' + (k % 2 ? 128 + i : 0) + ',' + i + ',.5)';
                arc(U - i / 48, 24 - i / 32, 8 - i / U, 0, M.PI * 2, 1);
                fill()
            }
        } else for (i = W; x = T(i) * U, y = Q() * 32 - U, E = x - 10, D = y - 12, B = M.sqrt(E * E + D * D), R = (70 + B * 4) * (L = k / 9 + .8) >> 1, i--;) if (x * x + y * y < 256) {
            strokeStyle = (V = 'rgba(') + R + ',' + (R + (B * L >> 2)) + ',40,.1)';
            beginPath();
            moveTo(U + x / 2, U + y / 2);
            lineTo(U + x, U + y);
            stroke()
        }
    }
}
for (j = 200; j--;) for (H = j + M.sqrt(j) * 25, L = H / U, R = Q() * W, y = H / 2 - 99, x = z = i = 0; V = 3, S = i / L * 20, i < L; i++, x += T(R) * V + Q() * 6 - 3, z += T(R - 11) * V + Q() * 6 - 3, y += Q() * 8 - 4, J[O++] = {
    x: x,
    y: y,
    z: z,
    n: S >> 1
}) if (i + 1 >= L && Q() > .8) V = 9, S += Q() * 4;
F()