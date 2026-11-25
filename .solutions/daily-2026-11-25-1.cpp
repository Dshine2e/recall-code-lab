#include <bits/stdc++.h>
using namespace std;
int main() {
    string s;
    getline(cin, s);
    int cnt[26] = {0};
    for (char c : s) {
        if (isalpha((unsigned char)c)) cnt[tolower((unsigned char)c) - 'a']++;
    }
    string miss;
    for (int i = 0; i < 26; i++) if (cnt[i] == 0) miss += char('a' + i);
    cout << (miss.empty() ? string("없음") : miss) << "\n";
    int best = 0;
    for (int i = 1; i < 26; i++) if (cnt[i] > cnt[best]) best = i;
    cout << char('a' + best) << " " << cnt[best] << "\n";
    return 0;
}
