#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n;
    cin >> n;
    priority_queue<long long> lo;
    priority_queue<long long, vector<long long>, greater<long long>> hi;
    string out;
    for (int i = 0; i < n; i++) {
        long long x;
        cin >> x;
        lo.push(x);
        hi.push(lo.top());
        lo.pop();
        if (hi.size() > lo.size()) {
            lo.push(hi.top());
            hi.pop();
        }
        out += to_string(lo.top());
        out += '\n';
    }
    cout << out;
    return 0;
}
