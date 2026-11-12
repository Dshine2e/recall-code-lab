#include <bits/stdc++.h>
using namespace std;

int main() {
    int n;
    cin >> n;
    map<string, int> cnt;
    for (int i = 0; i < n; i++) { string w; cin >> w; cnt[w]++; }
    string best; int bestCount = 0;
    for (auto& [w, c] : cnt)            // map 은 사전순이므로 처음 만난 최댓값이 답
        if (c > bestCount) { best = w; bestCount = c; }
    cout << best << '\n';
}
