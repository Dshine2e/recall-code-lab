#include <bits/stdc++.h>
using namespace std;

struct P {
    string name;
    int solved;
    long long pen;
};

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n;
    cin >> n;
    vector<P> v(n);
    for (auto &x : v) cin >> x.name >> x.solved >> x.pen;
    sort(v.begin(), v.end(), [](const P &a, const P &b) {
        if (a.solved != b.solved) return a.solved > b.solved;
        if (a.pen != b.pen) return a.pen < b.pen;
        return a.name < b.name;
    });
    string out;
    int rank = 0;
    for (int i = 0; i < n; i++) {
        if (i == 0 || v[i].solved != v[i - 1].solved || v[i].pen != v[i - 1].pen) rank = i + 1;
        out += to_string(rank) + " " + v[i].name + "\n";
    }
    cout << out;
    return 0;
}
