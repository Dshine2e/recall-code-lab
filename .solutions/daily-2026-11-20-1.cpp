#include <bits/stdc++.h>
using namespace std;

int main() {
    int n;
    cin >> n;
    vector<int> h(n);
    for (auto &x : h) cin >> x;
    int up = INT_MIN, upDay = -1, down = INT_MAX, downDay = -1;
    for (int i = 1; i < n; i++) {
        int d = h[i] - h[i - 1];
        if (d > up) { up = d; upDay = i + 1; }
        if (d <= down) { down = d; downDay = i + 1; }
    }
    cout << up << ' ' << upDay << '\n' << down << ' ' << downDay << '\n';
    return 0;
}
