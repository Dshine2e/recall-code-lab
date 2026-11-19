#include <bits/stdc++.h>
using namespace std;

int main() {
    string a, b;
    cin >> a >> b;
    int ca[26] = {0}, cb[26] = {0};
    for (char c : a) ca[c - 'a']++;
    for (char c : b) cb[c - 'a']++;
    int removed = 0;
    string rest;
    for (int i = 0; i < 26; i++) {
        removed += abs(ca[i] - cb[i]);
        rest += string(min(ca[i], cb[i]), char('a' + i));
    }
    cout << removed << "\n" << (rest.empty() ? "EMPTY" : rest) << "\n";
    return 0;
}
