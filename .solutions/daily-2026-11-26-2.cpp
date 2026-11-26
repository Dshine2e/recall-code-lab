#include <bits/stdc++.h>
using namespace std;

int main() {
    int f, q;
    cin >> f >> q;
    int cur = 1, total = 0, cut = 0;
    while (q--) {
        string cmd;
        int v;
        cin >> cmd >> v;
        int target;
        if (cmd == "UP") target = cur + v;
        else if (cmd == "DOWN") target = cur - v;
        else target = v;
        int real = target;
        if (real > f) real = f;
        if (real < 1) real = 1;
        if (real != target) cut++;
        total += abs(real - cur);
        cur = real;
    }
    cout << cur << '\n' << total << '\n' << cut << '\n';
    return 0;
}
