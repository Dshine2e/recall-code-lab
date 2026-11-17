#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int q;
    cin >> q;
    deque<int> dq;
    bool rev = false;
    string out;
    while (q--) {
        char c;
        cin >> c;
        if (c == 'F' || c == 'B') {
            int x;
            cin >> x;
            bool front = (c == 'F') ^ rev;
            if (front) dq.push_front(x);
            else dq.push_back(x);
        } else if (c == 'R') {
            rev = !rev;
        } else {
            if (dq.empty()) {
                out += "EMPTY\n";
                continue;
            }
            bool front = (c == 'P') ^ rev;
            int x;
            if (front) {
                x = dq.front();
                dq.pop_front();
            } else {
                x = dq.back();
                dq.pop_back();
            }
            out += to_string(x) + "\n";
        }
    }
    out += to_string(dq.size()) + "\n";
    if (!dq.empty()) {
        vector<int> v(dq.begin(), dq.end());
        if (rev) reverse(v.begin(), v.end());
        for (size_t i = 0; i < v.size(); i++) {
            if (i) out += ' ';
            out += to_string(v[i]);
        }
        out += "\n";
    }
    cout << out;
    return 0;
}
