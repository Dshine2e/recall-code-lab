#include <bits/stdc++.h>
using namespace std;

int main() {
    string s, w;
    cin >> s >> w;
    int have[26] = {0}, need[26] = {0};
    for (char c : s) have[c - 'a']++;
    for (char c : w) need[c - 'a']++;
    int best = INT_MAX;
    for (int i = 0; i < 26; i++) {
        if (need[i] > 0) best = min(best, have[i] / need[i]);
    }
    cout << best << '\n';
    return 0;
}
