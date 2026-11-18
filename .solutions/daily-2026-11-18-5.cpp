#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    const int unit[5] = {10, 50, 100, 500, 1000};
    long long cnt[5];
    for (int k = 0; k < 5; k++) cin >> cnt[k];
    int q;
    cin >> q;
    string out;
    while (q--) {
        long long price, in[5], paid = 0;
        cin >> price;
        for (int k = 0; k < 5; k++) {
            cin >> in[k];
            paid += in[k] * unit[k];
        }
        if (paid < price) {
            out += "REJECT\n";
            continue;
        }
        long long tmp[5];
        for (int k = 0; k < 5; k++) tmp[k] = cnt[k] + in[k];
        long long rest = paid - price, pieces = 0;
        for (int k = 4; k >= 0; k--) {
            long long use = min(tmp[k], rest / unit[k]);
            tmp[k] -= use;
            rest -= use * unit[k];
            pieces += use;
        }
        if (rest > 0) {
            out += "NOCHANGE\n";
            continue;
        }
        for (int k = 0; k < 5; k++) cnt[k] = tmp[k];
        out += "OK " + to_string(pieces) + "\n";
    }
    for (int k = 0; k < 5; k++) out += to_string(cnt[k]) + (k < 4 ? " " : "\n");
    cout << out;
    return 0;
}
