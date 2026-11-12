#include <bits/stdc++.h>
using namespace std;

int main() {
    int n;
    cin >> n;
    priority_queue<int, vector<int>, greater<int>> h;
    for (int i = 0; i < n; i++) { int x; cin >> x; h.push(x); }
    bool first = true;
    while (!h.empty()) {
        if (!first) cout << ' ';
        cout << h.top(); h.pop();
        first = false;
    }
    cout << '\n';
}
