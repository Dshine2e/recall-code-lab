#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, k;
    cin >> n >> k;
    priority_queue<int, vector<int>, greater<int>> pq;
    string out;
    out.reserve(n * 11);
    for (int i = 0; i < n; i++) {
        int x;
        cin >> x;
        pq.push(x);
        if ((int)pq.size() > k) pq.pop();
        if (i) out += ' ';
        out += ((int)pq.size() == k) ? to_string(pq.top()) : string("-1");
    }
    cout << out << '\n';
    return 0;
}
