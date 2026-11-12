#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n;
    long long q;
    cin >> n >> q;
    vector<long long> need(n), done(n);
    queue<int> line;
    for (int i = 0; i < n; i++) {
        cin >> need[i];
        line.push(i);
    }
    long long clock = 0;
    while (!line.empty()) {
        int who = line.front();
        line.pop();
        long long use = min(q, need[who]);
        clock += use;
        need[who] -= use;
        if (need[who] == 0) done[who] = clock;
        else line.push(who);
    }
    string out;
    for (int i = 0; i < n; i++) {
        out += to_string(done[i]);
        out += '\n';
    }
    cout << out;
    return 0;
}
