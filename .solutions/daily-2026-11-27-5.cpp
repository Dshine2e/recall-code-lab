#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int q;
    cin >> q;
    deque<long long> head;  // head[0] 이 지금 레일의 맨 앞(방향 표시와 함께)
    bool rev = false;
    string out;
    for (int k = 0; k < q; k++) {
        int c;
        cin >> c;
        if (c == 1 || c == 2) {
            long long x;
            cin >> x;
            bool atFront = (c == 1);
            if (rev) atFront = !atFront;
            if (atFront) head.push_front(x);
            else head.push_back(x);
        } else if (c == 3) {
            if (head.empty()) {
                out += "-1\n";
            } else if (!rev) {
                out += to_string(head.front()) + "\n";
                head.pop_front();
            } else {
                out += to_string(head.back()) + "\n";
                head.pop_back();
            }
        } else {
            rev = !rev;
        }
    }
    if (head.empty()) {
        out += "EMPTY\n";
    } else {
        vector<long long> v(head.begin(), head.end());
        if (rev) reverse(v.begin(), v.end());
        for (size_t i = 0; i < v.size(); i++) {
            if (i) out += ' ';
            out += to_string(v[i]);
        }
        out += '\n';
    }
    cout << out;
    return 0;
}
