#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int q;
    cin >> q;
    vector<int> xs(q);
    for (auto &x : xs) cin >> x;
    const int M = 1000000;
    vector<int> spf(M + 1, 0);
    for (int i = 2; i <= M; i++) {
        if (spf[i] == 0) {
            for (int j = i; j <= M; j += i)
                if (spf[j] == 0) spf[j] = i;
        }
    }
    string out;
    for (int x : xs) {
        int divs = 1, big = 0;
        while (x > 1) {
            int p = spf[x], e = 0;
            while (x % p == 0) {
                x /= p;
                e++;
            }
            divs *= e + 1;
            big = max(big, p);
        }
        out += to_string(big) + " " + to_string(divs) + "\n";
    }
    cout << out;
    return 0;
}
