#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, k;
    cin >> n >> k;
    vector<queue<long long>> lines(k);
    vector<long long> lastEnd(k, 0);
    string out;
    for (int i = 0; i < n; i++) {
        long long a, s;
        cin >> a >> s;
        int best = -1;
        for (int j = 0; j < k; j++) {
            while (!lines[j].empty() && lines[j].front() <= a) lines[j].pop();
            if (best < 0 || lines[j].size() < lines[best].size()) best = j;
        }
        long long start = lines[best].empty() ? a : max(a, lastEnd[best]);
        long long fin = start + s;
        lines[best].push(fin);
        lastEnd[best] = fin;
        out += to_string(best + 1) + " " + to_string(fin) + "\n";
    }
    cout << out;
    return 0;
}
