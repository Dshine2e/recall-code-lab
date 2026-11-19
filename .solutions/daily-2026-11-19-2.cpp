#include <bits/stdc++.h>
using namespace std;

int main() {
    string s;
    cin >> s;
    vector<pair<string, int>> items;
    size_t i = 0;
    while (i < s.size()) {
        string name;
        while (i < s.size() && isalpha((unsigned char)s[i])) name += s[i++];
        int q = 0;
        while (i < s.size() && isdigit((unsigned char)s[i])) q = q * 10 + (s[i++] - '0');
        items.push_back({name, q});
    }
    int total = 0;
    int best = 0;
    for (int k = 0; k < (int)items.size(); k++) {
        total += items[k].second;
        if (items[k].second > items[best].second) best = k;
    }
    cout << items.size() << " " << total << "\n";
    cout << items[best].first << " " << items[best].second << "\n";
    return 0;
}
