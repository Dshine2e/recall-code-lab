#include <bits/stdc++.h>
using namespace std;
int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int n; string s; cin >> n >> s;
    deque<int> dq;
    for (int i = n; i >= 1; i--) {
        if (!dq.empty()) {
            if (s[i - 1] == 'R') { int x = dq.back(); dq.pop_back(); dq.push_front(x); }
            else { int x = dq.front(); dq.pop_front(); dq.push_back(x); }
        }
        dq.push_front(i);
    }
    string out;
    for (size_t i = 0; i < dq.size(); i++) { if (i) out += ' '; out += to_string(dq[i]); }
    cout << out << "\n";
}
