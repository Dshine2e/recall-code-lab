#include <bits/stdc++.h>
using namespace std;

int main() {
    int n;
    cin >> n;
    vector<int> a(n);
    for (auto& x : a) cin >> x;
    sort(a.begin(), a.end(), greater<int>());
    const char* names[3] = {"GOLD", "SILVER", "BRONZE"};
    int medal = 0, i = 0;
    while (i < n && medal < 3) {
        int j = i;
        while (j < n && a[j] == a[i]) j++;
        cout << names[medal] << ' ' << a[i] << ' ' << (j - i) << '\n';
        medal++;
        i = j;
    }
    return 0;
}
